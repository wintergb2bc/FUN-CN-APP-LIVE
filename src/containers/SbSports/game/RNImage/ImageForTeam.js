import React from "react";
import RNImage from "./index";
import { vendorImageList } from "../../lib/js/vendorImageList";
import {Image} from "react-native";

const defaultImageNameMap = {
  'BTI': require('../../images/betting/fun88.png'),
  'IM': require('../../images/betting/IM.png'),
  'SABA': require('../../images/betting/saba.png'),
}

const ImageForTeam = ({ Vendor=null, TeamId, imgSize=23, IconUrl=null}) => {

  let selectedVendor = window.VendorData; //默認使用全局VendorData
  //如果傳入Vendor 則以傳入的Vendor為主
  if (Vendor && Vendor.configs && Vendor.configs.VendorName) {
    selectedVendor = Vendor;
  }

  const vendorName = selectedVendor.configs.VendorName;
  const vendorNameLower = vendorName.toLowerCase();

  const imgDomain = SportImageUrl;
  const folderName = vendorNameLower + '-icon';

  const defaultImg = (defaultImageNameMap[vendorName] ? defaultImageNameMap[vendorName] : defaultImageNameMap['IM']);

  let targetImg = {uri: imgDomain + `/${folderName}/TeamImageFile/${TeamId}.png`};
  let useDefaultImg = false;
  if (!selectedVendor.configs.HasTeamIcon) {
    targetImg = defaultImg;
    useDefaultImg = true;
  } else {
    if (IconUrl) {
      targetImg = {uri: IconUrl};
    } else {
      //查看圖片清單有沒有
      const propName = vendorNameLower + '-teams';
      if (vendorImageList[propName] && !vendorImageList[propName]['i_' + TeamId]) {
        targetImg = defaultImg;
        useDefaultImg = true;
      }
    }
  }

  //如果只用默認圖，就不需要RNImage的特殊功能
  return (
    useDefaultImg
      ? <Image source={targetImg} resizeMode='stretch' style={{ width: imgSize, height: imgSize }} />
      : <RNImage img={targetImg} defaultImg={defaultImg} resizeMode='stretch' style={{ width: imgSize, height: imgSize }} />
  );
};

export default ImageForTeam;
