//
//  openinstall.m
//  UMComponent
//
//  Created by Benjie Lai on 2018/11/26.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "openinstall.h"
@import FraudForce;
@import Eagleeyes.DevicePrint;
@implementation CoomaanTools


RCT_EXPORT_MODULE();
//  对外提供调用方法,演示Callback

RCT_EXPORT_METHOD(getAffCode:(RCTResponseSenderBlock)callback)
{
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"AffCode"];//获取项目版本号
    callback(@[[NSNull null],version]);
  
  
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
