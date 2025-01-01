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

    function isAuthorized(address pat,address client ) public view returns (bool success){
        return Authorized[pat][client];
    }
    
    //Check whether the doctor is registered or not
     function isRegistered(address addr) public view returns (bool success){
        doctor memory doc = doctors[addr];
        return Registered[doc.name][doc.licenseno];
    }
    

//Add terecords of the patient
    function addRecord(string memory _dname,string memory _reason,string memory _visitedDate,string memory _ipfs, address addr) public{
        require(isPatient[addr],"No patient found at the given address");
        
        if(Authorized[addr][msg.sender]){
                patients[addr].records.push(Records(_dname,_reason,_visitedDate,_ipfs));
        }
        else 
        revert("Record cannot be added ");
       
       
        // require(Authorized[addr][msg.sender],"You do not have permission to add records!");
        // require(isPatient[addr],"User Not registered");
        // patients[addr].records.push(Records(_dname,_reason,_visitedDate,_ipfs));
    }
    

  //get the length of records of particular address  
     function getrecordlist(address _addr)  public view returns (uint256 ){  
     return (patients[_addr].records.length);
     }

//get the length of doctor's added in blockchain
// function getdoctorlist() public view returns(uint256){
//         return doctorList.length;
//     }
   
   //get the length of registered doctor 
// function getRegisteredDoctorslength() public view returns(uint256){
//         return registeredDoctorList.length;
//     }

// //
// function getRegisteredDoctorsList(uint256 id) public view returns(uint256 license){
//         return registeredDoctorList[id];
//     }
    

//add doctor 
    function addDoctor(string memory _name,string memory _hname,string memory _faculty,string memory _contact,uint256 license) public {
        require(!isDoctor[msg.sender],"Already Registered");
        require(msg.sender != owner,"Contract owner cannot register as doctor");
        require(bytes(_name).length>0);
        require(bytes(_hname).length>0);
        require(bytes(_faculty).length>0);
        require(bytes(_contact).length>0);
        require(license>0);  
        address _addr = msg.sender;
        doctorList.push(_addr);

        dindex = dindex + 1;
        isDoctor[_addr]=true;
        doctors[_addr].name = _name;
        doctors[_addr].contact =_contact;
        doctors[_addr].hname = _hname;
        doctors[_addr].faculty =_faculty; 
        doctors[_addr].addr = _addr;
        doctors[_addr].licenseno = license;
        doctors[_addr].isApproved = false;
        
        if (Registered[_name][license] == true){
            doctors[_addr].isApproved = true;
        }
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
//get doctor's details  for verification
    // function getDoctorbyLicense(uint256 license) public view returns(uint256 id, string memory name,string memory hospital, string memory _faculty,address addr,bool isApproved,uint256 licenseno){
       
    //      uint256 i=0;
    //     for(i = 0;i<doctorList.length;i++){
    //     if(doctors[doctorList[i]].licenseno==license){
    //         break;
    //     }
    // }    
    // doctor memory doc = doctors[doctorList[i]];
    // require(isDoctor[doc.addr]==true,"Doctor hasn't signed up in meDossier");
    //      require(doc.isApproved==true,"Doctor is not approved");
        
        
    //     return (doc.id,doc.name,doc.hname,doc.faculty,doc.addr,doc.isApproved,doc.licenseno) ;
       
    // }
    
//  function getDoctorbyName(string memory _name) public view returns(uint256 id,string memory name , string memory contact ,string memory hname ,string memory faculty ,address addr , bool isApproved,uint256 licenseno)  {
//         uint256 i=0;
//         for(i = 0;i<doctorList.length;i++){
//         if(keccak256(bytes(doctors[doctorList[i]].name)) == keccak256(bytes(_name))){
//             break;
//         }
//     }    
//         require(keccak256(bytes(doctors[doctorList[i]].name)) == keccak256(bytes(_name)),"Doctor doesn't exists with the given name");
//         doctor memory doc = doctors[doctorList[i]];
//         return (doc.id,doc.name,doc.contact,doc.hname,doc.faculty,doc.addr, doc.isApproved,doc.licenseno);
//     }
    

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