pragma solidity ^0.4.17;

contract Adoption {

  // claim the variables
  address[16] public adopters;  
  bool[16] public IfMatch;

    // the adoption function;'.,,
  function adopt(uint ID) public returns (uint) {
    require(ID >= 0 && ID <= 15);  // make sure id is in [0,15]
                                         // otherwise fall back
    //msg.sender is the address of the people using this function
    adopters[ID] = msg.sender;        // save the address
    return ID;
  }


  // the getAdopters function
  function getAdopters() public view returns (address[16]) {
    return adopters;
  }

  function IsAdressMatch() public returns (bool[16]) {
       address current_address = msg.sender; 
       for (uint i = 0; i < adopters.length; i++) {
           if (current_address == adopters[i])
           {
               IfMatch[i] = true;
           }
           if (current_address != adopters[i])
           {
               IfMatch[i] = false;
           }
       }
       return IfMatch;
  }

}