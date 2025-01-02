// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "./patient.sol";

contract meDossier is PatientContract{

    struct doctor {
        uint256 id;
        string name;
        string contact;
        string hname;
        string faculty;
        address addr;
        uint256 licenseno;
        bool isApproved;
    }
    
    address[] public doctorList;
    uint256 [] public registeredDoctorList;
    address public  owner;

    mapping(address=>doctor) doctors;    
    
    constructor() {
        owner = msg.sender;
        
    }
    
     //identity the user 
     function user(address addr) public view returns (int success){
        if(isDoctor[addr]==true){
            return 0;
        }
        else if(isPatient[addr]==true){
            return 1;
        }
        else if(addr==owner){
            return 2;
        }
        else{
            return 3;
        }
    }

    //Register the doctor by certain authority
    function registerDoctor(string memory docname, uint256 license) public {
        require(msg.sender==owner,"You are not allowed to register doctor!");
        Registered[docname][license] = true;
        registeredDoctorList.push(license);
    
    }

    // function isAuthorized(address pat,address client ) public view returns (bool success){
    //     return Authorized[pat][client];
    // }
    
    //Check whether the doctor is registered or not
    //  function isRegistered(address addr) public view returns (bool success){
    //     doctor memory doc = doctors[addr];
    //     return Registered[doc.name][doc.licenseno];
    // }
    

//Add terecords of the patient
    function addRecord(string memory _dname,string memory _reason,string memory _visitedDate,string memory _ipfs, address addr) public{
        require(isPatient[addr],"No patient found at the given address");
        
        if(Authorized[addr][msg.sender]){
                patients[addr].records.push(Records(_dname,_reason,_visitedDate,_ipfs));
        }
        else 
        revert("Record cannot be added ");
    }

    function deleteRecord(address patientAddr, string memory _ipfs) public {
        require(isPatient[patientAddr], "No patient found at the given address");
        require(Authorized[patientAddr][msg.sender], "You are not authorized to delete records for this patient");

        // Lấy danh sách bản ghi của bệnh nhân
        Records[] storage records = patients[patientAddr].records;
        uint256 recordIndex = records.length;

        // Tìm bản ghi có IPFS khớp
        for (uint256 i = 0; i < records.length; i++) {
            if (keccak256(abi.encodePacked(records[i].ipfs)) == keccak256(abi.encodePacked(_ipfs))) {
                recordIndex = i;
                break;
            }
        }

        require(recordIndex < records.length, "Record with the given IPFS not found");

        // Xóa bản ghi bằng cách di chuyển phần tử cuối cùng vào vị trí bị xóa
        if (recordIndex < records.length - 1) {
            records[recordIndex] = records[records.length - 1];
        }

        // Giảm chiều dài danh sách
        records.pop();
    }
    

//add doctor 
    function addDoctor(
        string memory _name,
        string memory _hname,
        string memory _faculty,
        string memory _contact,
        uint256 license
    ) public {
        require(!isDoctor[msg.sender], "Already Registered");
        require(msg.sender != owner, "Contract owner cannot register as doctor");
        // require(msg.sender != patient, "Patient cannot register as doctor");
        require(bytes(_name).length > 0, "Doctor name is required");
        require(bytes(_hname).length > 0, "Hospital name is required");
        require(bytes(_faculty).length > 0, "Faculty is required");
        require(bytes(_contact).length > 0, "Contact is required");
        // require(license > 0, "License number must be greater than 0");
        require(Registered[_name][license], "Doctor license is not registered");

        address _addr = msg.sender;
        doctorList.push(_addr);

        dindex = dindex + 1;
        isDoctor[_addr] = true;
        doctors[_addr].name = _name;
        doctors[_addr].contact = _contact;
        doctors[_addr].hname = _hname;
        doctors[_addr].faculty = _faculty;
        doctors[_addr].addr = _addr;
        doctors[_addr].licenseno = license;
        doctors[_addr].isApproved = true; // Set to true since license is registered
    }



    function getAllDoctors() public view returns (
    uint256[] memory ids,
    string[] memory names,
    string[] memory contacts,
    string[] memory hospitals,
    string[] memory faculties,
    address[] memory addresses,
    bool[] memory approvals,
    uint256[] memory licenses
    ) {
        uint256 doctorCount = doctorList.length;
        
        ids = new uint256[](doctorCount);
        names = new string[](doctorCount);
        contacts = new string[](doctorCount);
        hospitals = new string[](doctorCount);
        faculties = new string[](doctorCount);
        addresses = new address[](doctorCount);
        approvals = new bool[](doctorCount);
        licenses = new uint256[](doctorCount);

        for (uint256 i = 0; i < doctorCount; i++) {
            doctor memory doc = doctors[doctorList[i]];
            ids[i] = doc.id;
            names[i] = doc.name;
            contacts[i] = doc.contact;
            hospitals[i] = doc.hname;
            faculties[i] = doc.faculty;
            addresses[i] = doc.addr;
            approvals[i] = doc.isApproved;
            licenses[i] = doc.licenseno;
        }
    }
    

 function getDoctorByAddress(address _address) public view returns(uint256 id,string memory name , string memory contact ,string memory hname ,string memory faculty ,address addr , bool isApproved,uint256 licenseno) {
        // require(doctors[_address].isApproved,"Doctor is not Approved or doesn't exist");
        doctor memory doc = doctors[_address];
        return (doc.id,doc.name,doc.contact,doc.hname,doc.faculty,doc.addr,doc.isApproved,doc.licenseno);
    } 
    

//Give access to certain address
//     function grantAccess(address _addr) public returns (bool success)
//     {   require(msg.sender != _addr,"You cannot add yourself");
//         require(isDoctor[_addr],"Not registered as doctor");
//         require(!Authorized[msg.sender][_addr],"User is already authorized");
//         Authorized[msg.sender][_addr] = true;
//         return true;
//     }

// //Revoke access of patient records from certain address
//       function revoke_access(address _addr)  public returns (bool success){
//         require(msg.sender!=_addr,"You can't remove yourself");
//         require(Authorized[msg.sender][_addr],"User is not authorized yet");
//         Authorized[msg.sender][_addr] = false;
//         return true;
    // }

// function doctorLogin() public{
//     if(Registered[doctors[msg.sender].name][doctors[msg.sender].licenseno] == true){
//         doctors[msg.sender].isApproved = true;
//     }
// }

}