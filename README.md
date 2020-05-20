<!--
    1.  logger
    2.  login session, authentication
    3.  session in DB
    4.  custom HttpCode
    5.  限制 IP
    6.  redis, nosql, sql,
    7.  authorization
    8.  MVC pattern - service
    9.  docker
    10. part of BDD
    11. ts 編譯問題
    12. CI/CD

    TODO
    1. 建言 api
    2. WebSocket
-->

### 套件目錄

1. morgan: 記錄請求
2. limiter: 限制請求
3. passport: 認證請求
4. express-session: 使用 mongo 作為儲存庫
5. sequelize: mysql 的 ORM
6. mongoose: mongo 的 ORM
7. redis: redis
8. bcrypt: 密碼雜湊
9. helmet: header 檢查資安
10. typescript: 型別檢查
11. jest: 測試
12. nodemon: 熱開發

### 開發工具

1. vscode
2. docker
3. insomnia
4. fork
5. yarn
6. circle CI
7. google cloud platform (GCP)

### 引用規則

使用 lib 引用名稱皆為大駝峰

```js
import Express from 'express';
```

內部模組則小駝峰

```js
import insideVariable from '../path/to/folder';
```

### 套件使用方向

>以插件形式使用套件。

盡量不要直接在 `app.ts` 使用 `app.use(LIBRARY)` ，反而在 package 先設定好，再由 `app.ts` 決定是否要使用

### API 流程

>router -> controller -> service (+ model) -> repository

1. router 接收資訊後交給 controller 處理，得到規範的格式 `{ status, result }` ，解開 status 並且回傳規範的格式 `{ result, message }`

1. controller 按照業務邏輯，拆分工作細節，分發給不同的服務 (service) 處理，再按照 service 給的回應，決定要返還給 router 的 `{ status, result}`

2. service 為可複利用。另外，因為專案小且資料種類不多，service 融合了 MVC pattern 的 model。並在特定時機可回覆 status，通常格式為 `[error, result|httpStatusCode]`

3. repository 由於本專案需要可替用資料庫，所以採用 repository pattern 剛剛好。

### 錯誤處理

> controller 捕捉錯誤後，分配對應的 httpStatusCode

整個 API 流程的重點在 **錯誤處理**

錯誤應該要發生在 service 與 model 這兩塊，controller 捕捉到錯誤後，利用 try catch 方式，決定回覆給 router 的資料，不同的 service 回復的錯誤也會有對應的 httpStatusCode，router 利用 httpStatusCode 回覆該對應的訊息，並記錄在 logger。

### Http Code and Error Code

為了方便表達 message，原本使用的套件 http status code 改用了自製的號碼表，檔案在 package/httpStatus ，
http status code 在 200~600 之間，
自訂的 error code 則是 1000 以上。

通常 error code 都是客端錯誤，所以回應時要把 status 算是 http code 的 400。

[文章摘要](https://www.itread01.com/content/1549447927.html) ：
- 定義錯誤提示級別，1 為服務端返回提示、2 為不提示、3 隱藏性賣萌提示。
- 定義具體的錯誤模組，登入相關 / 訂單相關 / 產品相關
- 具體錯誤編號，自增即可，一個專案 9999 種錯誤應該夠用；

我做法是 :
後端做一套，前端自己在做一套， 訊息主要是給 前端開發人員(我自己) 看的， 可以參考該文章錯誤模組。

定義為：
- 第 1 位 ： API 分類
- 第 2~3 位： 模組錯誤
    1. controller
    2. model
    3. routes
    4. service
    5. util
    6. config
    7. repository
    8. public
    9. app
- 第 4 位 開始： non-zero-filled 的寫法，如： 1001, 10011


### 命名規則

1. router 銜接父類命稱， ex: lang/search，而不用 lang/langSearch
2. controller 字尾是 Handler，命名方向可以模仿 router 命名
3. service 名稱要詳盡，checkReqData 讓人不懂是要檢查什麼， checkLanguageColumnContainReqData
4. repository 要有 ＣＲＵＤ 關鍵字

### 認證程序

> 此程序是任何請求的 middleware

本專案使用 passport.js
1. 請求進來
2. passport.initial: 解開 cookie 上的 uuid 得到的資料，通常是 id ，給下個方程式，若解不開或無此 cookie 則跳過下個步驟
3. passport.deserializeUser: 根據上個步驟得到的 id 於資料庫找到使用者資料並附加在 req 上


至此可以根據 req 是否有 user 屬性判斷是否為認證用戶，另外 passport 也有提供方法`req.isAuthenticated()`

### 登入程序

> passport 並不會因為認證失敗對登入策略做修改。

1. Passport.authenticate: 根據本專案的 local 策略，進入策略程序，策略規定我們此步驟必返回使用者資料，主要是 user.id
2. req.logIn: 此方法並非 express 提供，為 passport 附加的方法，此步驟的意義在於等到第 4 步驟的錯誤處理，目前尚未具備實質意義。會呼叫下一步驟並傳遞 user 資料。
3. Passport.serializeUser: 根據開發者 決定的屬性加密，例如： user.id，並把加密後的 uuid 要求使用者在 cookie 上紀錄。本專案使用 `user._id.toString()`，toString() 是 `mongo` 提供的方法，因為原本的 user._id 並非字串。
4. req.logIn: 若上一步驟有錯，看要如何錯誤處理，否則進入 `next()`。
