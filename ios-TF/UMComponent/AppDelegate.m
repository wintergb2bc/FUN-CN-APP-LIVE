/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

@import CoreLocation;
@import FraudForce;
 
#import <CodePush/CodePush.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNUMConfigure.h"
#import <UMAnalytics/MobClick.h>
#import <UMPush/UMessage.h>
#import "UMPushModule.h" 
#import "Orientation.h"
#import <PiwikPROSDK/PiwikPROSDK.h>

@interface AppDelegate () <CLLocationManagerDelegate, FraudForceDelegate>
@property (strong, nonatomic) CLLocationManager *locationManager;
@end



@interface AppDelegate ()
<UNUserNotificationCenterDelegate>

@end

@implementation AppDelegate

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  
  
  // Piwik 統計
  [PiwikTracker sharedInstanceWithSiteID:@"2d7472ee-2c34-4426-b638-c73dae1addca" baseURL:[NSURL URLWithString:@"https://analytics.gavelz.com"]];
  [[PiwikTracker sharedInstance] sendApplicationDownload];
  
 
  
  // 黑盒子
  if (CLLocationManager.locationServicesEnabled) {
    switch (CLLocationManager.authorizationStatus) {
      case kCLAuthorizationStatusAuthorizedAlways:
      case kCLAuthorizationStatusAuthorizedWhenInUse:
        // The app is authorized to track the device location. FraudForce will be able to do so as
        // well, however, this sample app is not designed to demonstrate the collection of such data.
        break;
      case kCLAuthorizationStatusDenied:
      case kCLAuthorizationStatusRestricted:
        // (Apple docs) "If the authorization status is restricted or denied, your app is not
        // permitted to use location services and you should abort your attempt to use them."
        break;
      case kCLAuthorizationStatusNotDetermined:
        // Request permission to access location data.
        self.locationManager = [CLLocationManager new];
        self.locationManager.delegate = self;
        [self.locationManager requestWhenInUseAuthorization];
        break;
    }
  }

  
  [FraudForce delegation:self];
  
    // 黑盒子
  
  [UMConfigure setLogEnabled:YES];
  
  
  /* Umeng init */
  [RNUMConfigure initWithAppkey:@"6285d089e60ab53d9a447990" channel:@"App Store"];
  /* [MobClick setScenarioType:E_UM_GAME|E_UM_DPLUS];*/
  [MobClick setScenarioType:E_UM_NORMAL];

  /* Share init */
 // [self setupUSharePlatforms];   // required: setting platforms on demand
  //[self setupUShareSettings];
  
  
  // Push's basic setting
  UMessageRegisterEntity * entity = [[UMessageRegisterEntity alloc] init];
  //type是对推送的几个参数的选择，可以选择一个或者多个。默认是三个全部打开，即：声音，弹窗，角标
  entity.types = UMessageAuthorizationOptionBadge|UMessageAuthorizationOptionAlert;
  [UNUserNotificationCenter currentNotificationCenter].delegate=self;
  
  [UMessage registerForRemoteNotificationsWithLaunchOptions:launchOptions Entity:entity completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
    } else {
    }
  }];
  
  //脸部识别初始化
//  NSString* licensePath = [[NSBundle mainBundle] pathForResource:FACE_LICENSE_NAME ofType:FACE_LICENSE_SUFFIX];
//  NSAssert([[NSFileManager defaultManager] fileExistsAtPath:licensePath], @"license文件路径不对，请仔细查看文档");
//  [[FaceSDKManager sharedInstance] setLicenseID:FACE_LICENSE_ID andLocalLicenceFile:licensePath];
//  NSLog(@"canWork = %d",[[FaceSDKManager sharedInstance] canWork]);
  
  NSURL *jsCodeLocation;

#ifdef DEBUG
  //jsCodeLocation = [NSURL URLWithString:@"http://192.168.1.200:8081/index.ios.bundle?platform=ios&dev=true"];
  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
  //jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
  jsCodeLocation = [CodePush bundleURL];
  //jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"bundle/index.ios" withExtension:@"jsbundle"];
#endif
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"UMComponent"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [Orientation getOrientation];
    //啟動白屏問題 處理 Benji
 [rootView setFrame:[UIScreen mainScreen].bounds];
  NSArray *nibs = [[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil];
  UIView *launchScreenView = nibs[0];
  [launchScreenView setFrame:[UIScreen mainScreen].bounds];
  [rootView setLoadingView: launchScreenView];
  return YES;
}



- (void)getInstallParamsFromSmartInstall:(id) params withError: (NSError *) error{
  //NSLog(@"安装参数params=%@",params);
  //    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"直接点击App进来的" message: params delegate:nil cancelButtonTitle:@"取消" otherButtonTitles:@"确定", nil];
  //    //弹出提示框（便于调试，调试完成后删除此代码）
  //    [alert show];
  
  NSDictionary *paramsDic = [self dictionaryWithJsonString:params];
  if (paramsDic){
    //获取到自定义参数存到本地
    NSLog(@"home参数1params=%@",paramsDic);
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setObject:paramsDic forKey:@"shareInstallParams"];
    // 手动调用NSUserDefaults去执行同步synchronize的动作，以及时保存（修改了的）数据
    [defaults synchronize];
    
    NSString *code = [defaults objectForKey:@"shareInstallParams"];
    NSLog(@"home参数2params=%@",code);
    
  }
}


#pragma mark json转字典
-(NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString
{
  if (jsonString == nil) {
    return @"";
  }
  
  NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  if (!jsonData) {
    return nil;
  }
  NSError *err;
  NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                      options:NSJSONReadingMutableContainers
                                                        error:&err];
  if(err)
  {
    return @"";
  }
  return dic;
}





#pragma mark - Push

 // IOS13
 - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
 {
   if (![deviceToken isKindOfClass:[NSData class]]) return;
   const unsigned *tokenBytes = (const unsigned *)[deviceToken bytes];
   NSString *hexToken = [NSString stringWithFormat:@"%08x%08x%08x%08x%08x%08x%08x%08x",
                         ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                         ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                         ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];
   
   NSLog(@"token=====%@",[[[[deviceToken description] stringByReplacingOccurrencesOfString: @"<" withString: @""]
                           stringByReplacingOccurrencesOfString: @">" withString: @""]
                          stringByReplacingOccurrencesOfString: @" " withString: @""]);
   // NSLog(@"deviceToken:%@",hexToken);
   [UMPushModule  registerDeviceToken:deviceToken];
 }

 //- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken{
 //  NSLog(@"token=====%@",[[[[deviceToken description] stringByReplacingOccurrencesOfString: @"<" withString: @""]
 //                          stringByReplacingOccurrencesOfString: @">" withString: @""]
 //                         stringByReplacingOccurrencesOfString: @" " withString: @""]);
 //  [UMPushModule  registerDeviceToken:deviceToken];
 //}

 // 注册deviceToken失败，此处失败，与环信SDK无关，一般是您的环境配置或者证书配置有误 友盟
 - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error{
   NSLog(@"注册deviceToken失败%@",error);
 }


 // iOS 10以上
 -(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
   NSDictionary * userInfo = notification.request.content.userInfo;
   NSLog(@"iOS 10以上%@",userInfo);
   if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
     //应用处于前台时的远程推送接受
     //关闭U-Push自带的弹出框
     [UMessage setAutoAlert:NO];
     //必须加这句代码
     [UMessage didReceiveRemoteNotification:userInfo];
     
   }else{
     //应用处于前台时的本地推送接受
   }
   //当应用处于前台时提示设置，需要哪个可以设置哪一个
   if (@available(iOS 10.0, *)) {
     completionHandler(UNNotificationPresentationOptionSound|UNNotificationPresentationOptionBadge|UNNotificationPresentationOptionAlert);
   } else {
     // Fallback on earlier versions
   }
   [[NSNotificationCenter defaultCenter] postNotificationName:@"didReceiveNotification" object:userInfo];
 }
 // 收到通知
 -(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler{
   NSDictionary * userInfo = response.notification.request.content.userInfo;
   NSLog(@"iOS外部 %@",userInfo);
   [[NSNotificationCenter defaultCenter] postNotificationName:@"didReceiveNotification" object:userInfo];
 }
 - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo{
   NSLog(@"iOS 10以下%@",userInfo);
   [[NSNotificationCenter defaultCenter] postNotificationName:@"didReceiveNotification" object:userInfo];
 }
 //- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
 //{
 //  NSLog(@"deviceToken==%@",[[[[deviceToken description] stringByReplacingOccurrencesOfString: @"<" withString: @""]
 //                             stringByReplacingOccurrencesOfString: @">" withString: @""]
 //                            stringByReplacingOccurrencesOfString: @" " withString: @""]);
 //  [UMessage registerDeviceToken:deviceToken];
 //}


- (void)applicationWillResignActive:(UIApplication *)application
{  // 黑盒子
  // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
  // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{  // 黑盒子
  // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
  // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{  // 黑盒子
  // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}


- (void)applicationWillTerminate:(UIApplication *)application
{  // 黑盒子
  // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

#pragma mark - Location Manager Delegate

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{  // 黑盒子 
  switch (status) {
    case kCLAuthorizationStatusAuthorizedAlways:
    case kCLAuthorizationStatusAuthorizedWhenInUse:
      // The app is authorized to track the device location. FraudForce will be able to do so as
      // well, however, this sample app is not designed to demonstrate the collection of such data,
      // so we just clear our strong referene to the object.
      self.locationManager = nil;
      break;
    case kCLAuthorizationStatusDenied:
    case kCLAuthorizationStatusRestricted:
      // Permission to track location has been denied. Neither the app nor FraudForce will be able
      // to track the device location unless the user grants permission in Settings.
      self.locationManager = nil;
      break;
    case kCLAuthorizationStatusNotDetermined:
      // When not determined, keep waiting (by continuing to retain the locationManager).
      break;
  }
}

#pragma mark - FraudForceDelegate protocol

- (BOOL)shouldEnableNetworkCalls {
  return YES;
}


@end
