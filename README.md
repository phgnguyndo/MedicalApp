# MedicalApp

* Để chạy smart contract cần ganache
    - Bật Ganache, tạo 1 workspace mới đặt tên "MedicalApp"
    - Xong sẽ có 1 mục để import thì sẽ chọn cho nó tới đường dẫn của file truffle-config.js
    - xong nhấn start
* Đối với MetaMask
    - Tải MetaMask trên chorme extention
    - Tạo tài khoản (Đoạn này k nhớ lắm có gì nhắn t)
    - Sau đó sẽ import 1 cái testnet trong ganache
    - Tạo tài khoản bẳng cách lấy private key trong ganache import vô metamask
* Chạy smart 
    - truffle compile
    - truffle migrate (nếu đoạn này chạy thành công, không báo lỗi là oce)
* Để chạy file index.html cần sửa 
    -  const contractAddress = "0x7EE94Bfb0Ab815a11E96d98EfA260c2a76016419"; // Địa chỉ của hợp đồng đã triển khai
    - const contractAbi = []; // ABI của hợp đồng MedicalRecords.sol