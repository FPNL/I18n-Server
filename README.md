### 引用規則
使用 lib 盡量用 import package = require('third-party-lib');
引用內部 import insideVariable from '../path/to/folder';

### API 流程

router -> controller -> service -> model


1. router 接收資訊後交給 controller 處理，controller 要回傳給 router 規範好的結果
{ status, message, result }

2. controller 按照業務邏輯，拆分工作細節，分發給不同的服務 (service) 處理，再按照 service 給的回應，
決定要返還給 router 的 status, result

3. service 重點為盡可能重複利用

4. 需要取資料則找 model

### 錯誤處理
摘要
1. service 捕捉並紀錄，再丟出。
2. controller 捕捉後，返還 伺服器錯誤 的訊息

整個 API 流程的重點在 **錯誤處理**

錯誤應該要發生在 service 與 model 這兩塊，
service 捕捉 (catch) 到錯誤 (error) 後，利用 throw error 方式 告知 controller 錯誤發生，
順便再告知 error code，
controller 則會回應伺服器錯誤，因為這代表流程有錯，或是程式碼有錯誤。

### Http Code and Error Code

為了方便表達 message，原本使用的套件 http status code 改用了自製的號碼表，檔案在 package/e，
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

router 銜接父類命稱， ex: lang/search，而不用 lang/langSearch
controller 字尾是 Handler，命名方向可以模仿 router 命名
service 名稱要詳盡，checkReqData 讓人不懂是要檢查什麼， checkLanguageColumnIncludeReqData
model 要有 ＣＲＵＤ 關鍵字

### 錯誤紀錄

待增...
