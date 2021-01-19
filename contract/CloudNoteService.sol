// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * 云笔记智能合约
 * The CloudNoteService contract
 */
contract CloudNoteService {

  //笔记标题=>笔记内容
  mapping ( string => string ) private  note;
  //保存账户的云笔记，用户id=>笔记
  mapping ( string => mapping ( string => string ) ) data;

  /**
   * 添加笔记
   */
  function addNote (string memory id, string memory name, string memory content ) public {

    //判空
    require (keccak256(abi.encodePacked(id)) != keccak256(""));
    require (keccak256(abi.encodePacked(name)) != keccak256(""));
    require (keccak256(abi.encodePacked(content)) != keccak256(""));
    //同一账户下云笔记名称不能相同
    require (keccak256(abi.encodePacked(data[id][name])) == keccak256(""));
    //将笔记内容添加到data中
    data[id][name] = content;
  }

  /**
   * 更新笔记
   */
  function updateNote (string memory id, string memory name, string memory content) public {
    //判空
    require (keccak256(abi.encodePacked(id)) != keccak256(""));
    require (keccak256(abi.encodePacked(name)) != keccak256(""));
    require (keccak256(abi.encodePacked(content)) != keccak256(""));
    //云笔记必须存在才可以修改
    require (keccak256(abi.encodePacked(data[id][name])) != keccak256(""));
    data[id][name] = content;
  }

  /**
   * 根据id和笔记名字查找笔记
   */
  function getNote (string memory id, string memory name) view public returns(string memory) {
   return data[id][name];
  }

}




// "10","小程序云笔记","今天学习了很多小程序云笔记"
// 0x1e97BfC3b4107ca1BA31b030931cAFa381E238D5
