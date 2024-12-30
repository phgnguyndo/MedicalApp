// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecords {
    mapping(address => uint) public recordCount;
    mapping(address => mapping(uint => Record)) public records;
    mapping(address => mapping(uint => bool)) public isDeleted;
    mapping(address => Role) public roles;

    struct Record {
        uint recordId;
        uint timestamp;
        string name;
        uint age;
        string gender;
        string bloodType;
        string allergies;
        string diagnosis;
        string treatment;
        string imageHash; // CID hoặc URL của hình ảnh
    }

    enum Role { NONE, ADMIN, DOCTOR }

    event MedicalRecords__AddRecord(
        address indexed user,
        uint recordId,
        uint timestamp,
        string name,
        uint age,
        string gender,
        string bloodType,
        string allergies,
        string diagnosis,
        string treatment,
        string imageHash
    );

    event MedicalRecords__DeleteRecord(address indexed user, uint recordId);
    event MedicalRecords__RoleAssigned(address account, Role role);

    modifier onlyAdmin() {
        require(roles[msg.sender] == Role.ADMIN, "Only admin can perform this action");
        _;
    }

    modifier onlyDoctorOrAdmin() {
        require(
            roles[msg.sender] == Role.DOCTOR || roles[msg.sender] == Role.ADMIN,
            "Only doctor or admin can perform this action"
        );
        _;
    }

    constructor() {
        roles[msg.sender] = Role.ADMIN; // Người deploy là admin mặc định
    }

    function assignRole(address _account, Role _role) public onlyAdmin {
        roles[_account] = _role;
        emit MedicalRecords__RoleAssigned(_account, _role);
    }

    function addRecord(
        string memory _name,
        uint _age,
        string memory _gender,
        string memory _bloodType,
        string memory _allergies,
        string memory _diagnosis,
        string memory _treatment,
        string memory _imageHash
    ) public {    //onlyDoctorOrAdmin
        recordCount[msg.sender]++;
        uint newRecordId = recordCount[msg.sender];
        records[msg.sender][newRecordId] = Record(
            newRecordId,
            block.timestamp,
            _name,
            _age,
            _gender,
            _bloodType,
            _allergies,
            _diagnosis,
            _treatment,
            _imageHash
        );
        emit MedicalRecords__AddRecord(
            msg.sender,
            newRecordId,
            block.timestamp,
            _name,
            _age,
            _gender,
            _bloodType,
            _allergies,
            _diagnosis,
            _treatment,
            _imageHash
        );
    }

    function deleteRecord(uint _recordId) public onlyDoctorOrAdmin {
        require(!isDeleted[msg.sender][_recordId], "The record is already deleted");
        isDeleted[msg.sender][_recordId] = true;
        emit MedicalRecords__DeleteRecord(msg.sender, _recordId);
    }

    function getRecord(address _user, uint _recordId)
        public
        view
        returns (
            uint,
            string memory,
            uint,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        require(!isDeleted[_user][_recordId], "The record is deleted");
        Record storage record = records[_user][_recordId];
        return (
            record.timestamp,
            record.name,
            record.age,
            record.gender,
            record.bloodType,
            record.allergies,
            record.diagnosis,
            record.treatment,
            record.imageHash
        );
    }
}
