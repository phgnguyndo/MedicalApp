// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract PatientContract{
    
    uint256 public pindex=0;
    uint256 public dindex=0;
    
    struct Records {
    string dname;
    string reason;
    string visitedDate;
    string ipfs;
    }
    
    struct patient{
        uint256 id;
        string name;
        string phone;
        string gender;
        string dob;
        string bloodgroup;
        Records[] records;
        address addr;
    }
    address[] private patientList;

    mapping(address=>patient) patients;
    mapping(address=>bool) isPatient;
    mapping(address=>bool) isDoctor;
    mapping(address=>mapping(address=>bool)) Authorized;
    mapping(string=>mapping(uint256=>bool)) Registered;
    
    
    function getPatientList() public view returns (address[] memory) {
    return patientList;
    }
    
    
    //add the patient to the blockchain
    function addPatient(string memory _name,string memory _phone,string memory _gender,string memory _dob,string memory _bloodgroup) public {
        require(!isPatient[msg.sender],"Already Patient account exists");
        require(bytes(_name).length>0);
        require(bytes(_phone).length>0);
        require(bytes(_gender).length>0);
        require(bytes(_dob).length>0);
        require(bytes(_bloodgroup).length>0);        
        patientList.push(msg.sender);
        pindex = pindex + 1;
        isPatient[msg.sender]=true;
        patients[msg.sender].id=pindex;
        patients[msg.sender].name=_name;
        patients[msg.sender].phone=_phone;
        patients[msg.sender].gender=_gender;
        patients[msg.sender].dob=_dob;
        patients[msg.sender].bloodgroup=_bloodgroup;
        patients[msg.sender].addr=msg.sender;
        
    }
    
    //get the details of the patients
    function getPatientDetails(address _addr) public view returns(string memory _name,string memory _phone,string memory _gender,string memory _dob,string memory _bloodgroup){
        require(isPatient[_addr],"No Patients found at the given address");
        patient memory pat = patients[_addr];
        return (pat.name,pat.phone,pat.gender,pat.dob,pat.bloodgroup);
    }

function getAllPatients() public view returns (
    uint256[] memory ids,
    address[] memory addresses,
    string[] memory names,
    string[] memory phones,
    string[] memory genders,
    string[] memory dobs,
    string[] memory bloodgroups
) {
    uint256 totalPatients = patientList.length;
    ids = new uint256[](totalPatients);
    addresses = new address[](totalPatients);
    names = new string[](totalPatients);
    phones = new string[](totalPatients);
    genders = new string[](totalPatients);
    dobs = new string[](totalPatients);
    bloodgroups = new string[](totalPatients);

    for (uint256 i = 0; i < totalPatients; i++) {
        address patientAddress = patientList[i];
        patient memory pat = patients[patientAddress];

        ids[i] = pat.id;
        addresses[i] = patientAddress;
        names[i] = pat.name;
        phones[i] = pat.phone;
        genders[i] = pat.gender;
        dobs[i] = pat.dob;
        bloodgroups[i] = pat.bloodgroup;
    }
}

    
//get patients record 
function getAllPatientRecords(address _addr) 
    public view 
    returns(
        string[] memory dnames, 
        string[] memory reasons, 
        string[] memory visitedDates, 
        string[] memory ipfsHashes
    ) 
{
    require(isPatient[_addr], "No patient found at the given address");
    // require(Authorized[_addr][msg.sender] || msg.sender == _addr, "Record cannot be accessed");

    uint256 recordCount = patients[_addr].records.length;
    dnames = new string[](recordCount);
    reasons = new string[](recordCount);
    visitedDates = new string[](recordCount);
    ipfsHashes = new string[](recordCount);

    for (uint256 i = 0; i < recordCount; i++) {
        dnames[i] = patients[_addr].records[i].dname;
        reasons[i] = patients[_addr].records[i].reason;
        visitedDates[i] = patients[_addr].records[i].visitedDate;
        ipfsHashes[i] = patients[_addr].records[i].ipfs;
    }
}


//Give access to certain address
    function grantAccess(address _addr) public returns (bool success)
    {   require(msg.sender != _addr,"You cannot add yourself");
        require(isDoctor[_addr],"Not registered as doctor");
        require(!Authorized[msg.sender][_addr],"User is already authorized");
        Authorized[msg.sender][_addr] = true;
        return true;
    }

}