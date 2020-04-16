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
controller 則會回應伺服器錯誤，因為這代表流程有錯，或是程式碼有錯誤。


### Http Code and Error Code

為了方便表達 message，原本使用的套件 http status code 改用了自製的號碼表，檔案在 package/e，
http status code 在 200~600 之間，
自訂的 error code 則是 10000 以上。

通常 error code 都是客端錯誤，所以回應時要把 status 算是 http code 的 400。

### 錯誤紀錄

待增...

