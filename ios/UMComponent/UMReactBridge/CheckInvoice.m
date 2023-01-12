//
//  CheckInvoice.m
//  aitepiao
//
//  Created by tc on 2018/8/28.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "CheckInvoice.h"
#import <React/RCTEventDispatcher.h>
#import <React/RCTBridge.h>

static CheckInvoice *_manager = nil;

@implementation CheckInvoice

RCT_EXPORT_MODULE()



-(instancetype)init{
  
  if (self = [super init]) {
    
      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(messageDidReceived:) name:@"didReceiveNotification" object:nil];
  }
  
  return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"didReceiveNotification", ];//有几个就写几个
}

-(void)messageDidReceived:(NSNotification *)notification{
  
  NSDictionary *body = notification.object;
  [self sendEventWithName:@"didReceiveNotification" body:body];
}


+ (BOOL)requiresMainQueueSetup {
  
  return YES;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}




@end
