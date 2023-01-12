//
//  DevicePrint.h
//  Eagleeyes
//
//  Created by E2 - Jackie on 30/03/2018.
//  Copyright © 2018 E2. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface DevicePrint : NSObject
+ (void)start:(NSString *)p ;
+ (void) start:(nonnull NSString *)p with:(nonnull UIWindow *)window;
+ (NSString *) getBlackBox;
+ (void) cleanup;

@end
