//
//  openinstall.m
//  UMComponent
//
//  Created by Benjie Lai on 2018/11/26.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "openinstall.h"
#import <TInstallSDK/TInstallSDK.h>

@import FraudForce;
@import Eagleeyes.DevicePrint;
@implementation CoomaanTools


RCT_EXPORT_MODULE();
//  对外提供调用方法,演示Callback
RCT_EXPORT_METHOD(getAffCode:(RCTResponseSenderBlock)callback)
{
    NSString * _Nullable FixedAffCode = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"AffCode"];
    //  NSLog(@"123qwe%@", FixedAffCode);
      if(FixedAffCode.length != 0) {
        //写死固定代理码affcode
        callback(@[FixedAffCode]);
      } else {
        //TInstall代理码affcode
        [TInstall getWithInstallResult:^(NSDictionary * _Nullable data) {
            NSString *err = @"err";
            if (data) {
                NSArray *dicArr = data.allKeys;
                if (dicArr.count > 0) {
                  NSString * _Nullable affCodeMax = [data valueForKey:@"affCode"];
                  NSString * _Nullable affcodeMin = [data valueForKey:@"affcode"];
                  NSString * _Nullable aff = [data valueForKey:@"aff"];
                  if (affCodeMax.length != 0) {
                    callback(@[affCodeMax]);
                  } else if (affcodeMin.length != 0) {
                    callback(@[affcodeMin]);
                  }  else if (aff.length != 0) {
                    callback(@[aff]);
                  } else {
                    callback(@[err]);
                  }
                } else {
                  callback(@[err]);
                }
            } else {
              callback(@[err]);
            }
        }];
      }
}

RCT_EXPORT_METHOD(getRafCode:(RCTResponseSenderBlock)callback)
{
  //TInstall代理码rafcode
  [TInstall getWithInstallResult:^(NSDictionary * _Nullable data) {
      NSString *rafErr = @"err";
      if (data) {
          NSArray *rafDicArr = data.allKeys;
          if (rafDicArr.count > 0) {
            NSString * _Nullable raf = [data valueForKey:@"raf"];
            if (raf.length != 0) {
              callback(@[raf]);
            } else {
              callback(@[rafErr]);
            }
          } else {
            callback(@[rafErr]);
          }
      } else {
        callback(@[rafErr]);
      }
  }];

}

RCT_EXPORT_METHOD(getVersion:(RCTResponseSenderBlock)callback)
{
//  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];//获取项目版本号
//  callback(@[[NSNull null],version]);


  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    NSString *blackbox = [FraudForce blackbox];
    callback(@[[NSNull null],blackbox]);
    
    
  });
  
  
  
}




RCT_EXPORT_METHOD(getOpeninstallCode:(RCTResponseSenderBlock)callback)
{
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *code = [defaults objectForKey:@"shareInstallParams"];
    
    //            UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"安装参数" message:code delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];
    //            [alert show];
    if(code){
      callback(@[[NSNull null],code]);
      //  NSLog(@"参数1code=%@",code);
    }
    
    
  });
}

RCT_EXPORT_METHOD(getE2BlackBox:(RCTResponseSenderBlock)callback)
{
  
  
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    NSString *blackbox = [DevicePrint getBlackBox];
    callback(@[[NSNull null],blackbox]);
    
    
  });
}






@end
