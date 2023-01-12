//
//  PushNative.m
//  RNAddNative
//

#import "PushNative.h"
#import "AppDelegate.h"
#import <PiwikPROSDK/PiwikPROSDK.h>
@implementation PushNative
RCT_EXPORT_MODULE();
// 接收传过来的 NSString


//點擊事件
RCT_EXPORT_METHOD(PiwikTackEvent:(NSString *)name details:(NSDictionary *)details){
  dispatch_async(dispatch_get_main_queue(), ^{
    //[libJBOSDK setToken:details[@"token"]];
    [[PiwikTracker sharedInstance] sendEventWithCategory:details[@"track"] action:details[@"action"] name:details[@"name"] value:@0];
    
    NSLog(@"觸發Piwik 點擊事件 %@", details[@"track"]);
  });
}

//menber code 紀錄
RCT_EXPORT_METHOD(PiwikTackMemberCode:(NSString *)name details:(NSDictionary *)details){
  dispatch_async(dispatch_get_main_queue(), ^{
    //[libJBOSDK setToken:details[@"token"]];
    //[[PiwikTracker sharedInstance] sendEventWithCategory:@"Tracker" action:@"touch" name:details[@"track"] value:@185];
    [PiwikTracker sharedInstance].userID = details[@"track"];

    NSLog(@"觸發Piwik 點擊事件 %@", details[@"track"]);
  });
}

//上傳版本號
RCT_EXPORT_METHOD(PiwikTackVersion:(NSString *)name details:(NSDictionary *)details){
  dispatch_async(dispatch_get_main_queue(), ^{
    //[libJBOSDK setToken:details[@"token"]];
    //[[PiwikTracker sharedInstance] sendEventWithCategory:@"Tracker" action:@"touch" name:details[@"track"] value:@185];
    [[PiwikTracker sharedInstance] setCustomVariableForIndex:4 name:@"AppRealVersion" value:details[@"track"] scope:CustomVariableScopeVisit];

    NSLog(@"觸發Piwik 點擊事件 %@", details[@"track"]);
  });
}



@end
