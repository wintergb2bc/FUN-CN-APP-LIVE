import React from 'react';
import { StyleSheet,WebView ,Text, View,TouchableOpacity ,PanResponder,Dimensions,Image,Platform,ScrollView} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {  Carousel,WhiteSpace, WingBlank ,Flex,Toast,InputItem,ActivityIndicator,List} from 'antd-mobile-rn';
import Touch from 'react-native-touch-once'; 
// import WebViewIOS from 'react-native-webview';

const {
  width ,height
} = Dimensions.get('window')


var _previousLeft=500;
var _previousTop=height/1.4;

var lastLeft=500;
var lastTop=height/1.4;

const CIRCLE_SIZE=70; 


class livechatDragHoliday extends React.Component {
	
	
	constructor(props) {
	    super(props);
		this.navigateToScene = this.navigateToScene.bind(this);
	    this._onOrientationChange = this._onOrientationChange.bind(this)
	    this.state = {
				GameReadplay:false,
				widthS:width,
				heightS:Platform.OS === "android" ? height-69 : height-63,
				menuOpen:true, 
				gametype:this.props.gametype,
	            payHtml:this.props.GameOpenUrl, 
				style: {tintColor: 'blue'},
				userName:'',
		   		userMoney:false,
				loadone:1, 
				pageTop:0,
				gameKey:Math.random(),
				moneyBox:'',
				widthBigH:false,
				Noreload:true, 
				LivechatDrag:false
	    }
			 
		this.onStartShouldSetPanResponder=this.onStartShouldSetPanResponder.bind(this);
		this.onMoveShouldSetPanResponder=this.onMoveShouldSetPanResponder.bind(this);
		this.onPanResponderGrant=this.onPanResponderGrant.bind(this);
		this.onPanResponderMove=this.onPanResponderMove.bind(this);
		this.onPanResponderEnd=this.onPanResponderEnd.bind(this); 
		
	  }

 
	componentWillMount(props) { 
 
			 this._panResponder=PanResponder.create({
				onStartShouldSetPanResponder:this.onStartShouldSetPanResponder,
				onMoveShouldSetPanResponder:this.onMoveShouldSetPanResponder,
				onPanResponderGrant:this.onPanResponderGrant,
				onPanResponderMove:this.onPanResponderMove,
				onPanResponderRelease:this.onPanResponderEnd,
				onPanResponderTerminate:this.onPanResponderEnd,
				onStartShouldSetPanResponderCapture:this.onStartShouldSetPanResponderCapture, 
				onMoveShouldSetPanResponderCapture:this.onMoveShouldSetPanResponderCapture, 
				}); 
			this.changePosition();


			// setInterval(() =>{  
			// 	this.changePosition();
			// 	console.log('ggggggg')
			//  },5000);

		
	  }
		
		componentWillUnmount(){  //離開註銷監聽 
			 
		}
		
		
		_onOrientationChange(curOrt){ 
				//console.log('在遊戲裡面改變方向1111') 
		}


	 

		
	widthHeight(){  //重新計算寬高
		const {
			width ,height
		} = Dimensions.get('window')
	//	//console.log('被監聽調用')
		if(this.state.widthS != width){
			 
			////console.log(width,height)
			if(width > height){
				this.setState({
					widthBigH:true,
					widthS:width,
					heightS:Platform.OS === "android" ? height-69 : height-45,
				}) 
			  
				_previousLeft=width/2 +50;
				_previousTop=30; 
				lastLeft=width/2 +50;
				lastTop=30;
				this.changePosition(); 
				this.setState({
					pageTop:0
				}) 
				
			}else{
			

				if(Platform.OS === "ios"){
					//console.log(height)
				  if(height >= 812){  
					this.setState({
						widthS:width,
						heightS:height-88,
					})
				  }else{ 
					this.setState({
						widthS:width,
						heightS:Platform.OS === "android" ? height-69 : height-63,
					})  
				  }
	
			  }else{
				this.setState({
					widthS:width,
					heightS:Platform.OS === "android" ? height-69 : height-63,
				}) 

			  }
			  
				_previousLeft=150;
				_previousTop=80;
				
				lastLeft=150;
				lastTop=80;
				let topse = Platform.OS === "android" ? 0 :31;
				this.setState({
					pageTop:0,
					widthBigH:false,
				})
				this.changePosition();
			}
			
		}
	
		
	}
	
	closeModal() {  //關閉頁面
		Actions.pop();
	}
	
	
	
	//用户开始触摸屏幕的时候，是否愿意成为响应者；
  onStartShouldSetPanResponder(evt, gestureState){
   return true;
  }
  //在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互；
  onMoveShouldSetPanResponder(evt, gestureState){
	//	//console.log(gestureState)
        if (
          (gestureState.dx < 2 && gestureState.dx > -2)
          && (gestureState.dy < 2 && gestureState.dy > -2)
        ) {
          return false;
        } 
			
        return true;
  }
  // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
  onPanResponderGrant(evt, gestureState){
    ////console.log('onPanResponderGrant...');
		const { dx, dy } = gestureState

   this.setState({
     style:{
         left:_previousLeft,
         top:_previousTop,
     }
   });
  }
  // 最近一次的移动距离为gestureState.move{X,Y}
  onPanResponderMove(evt, gestureState){
		
		 let widthS = this.state.widthS;
		 let heightS = this.state.heightS;
     _previousLeft=lastLeft+gestureState.dx;
     _previousTop=lastTop+gestureState.dy;

     if(_previousLeft<=0){
       _previousLeft=0;
     }
     if(_previousTop<=0){
       _previousTop=0;
     }
     if(_previousLeft>=widthS-CIRCLE_SIZE){
       _previousLeft=widthS-CIRCLE_SIZE;
     }
     if(_previousTop>=heightS-CIRCLE_SIZE){
       _previousTop=heightS-CIRCLE_SIZE;
     }

    //实时更新
    this.setState({
      style:{
          left:_previousLeft,
          top:_previousTop,
      }
    });
  }
  // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
  // 一般来说这意味着一个手势操作已经成功完成。
  onPanResponderEnd(evt, gestureState){

    lastLeft=_previousLeft;
    lastTop=_previousTop;

    this.changePosition();
  }

  /**
   根据位置做出相应处理
  **/
  changePosition(){
		
		let widthS = this.state.widthS;
		let heightS = this.state.heightS;
		

		if(_previousLeft+CIRCLE_SIZE/2<=widthS/2){
			//left
			_previousLeft=lastLeft=0;

			this.setState({
					style:{
						left:_previousLeft,
						top:_previousTop,
					}
				});
		}else{
			_previousLeft=lastLeft=widthS-CIRCLE_SIZE;

		this.setState({
				style:{
					left:_previousLeft,
					top:_previousTop,
				}
				});
		}
	
	 }
	
	OpenMenu(){
		//console.log('開menu拉')
		// this.setState({
		// 	menuOpen:this.state.menuOpen ? false :true,
		// })
		LiveChatOpenGlobe();
	}
	 
	navigateToScene(key,item) {
		//console.log(key)
		if (key === 'logout') {
			// not using mapDispatchToProps
			ApiPort.Token = "";
			
			global.storage.remove({
					key: 'username',
					id: 'namerb88'
			});
			
			global.storage.remove({
					key: 'password',
					id: 'passwordrb88'
			});
			
			global.storage.remove({
					key: 'memberInfo',
					id: 'memberInfos'
			});
			
			global.storage.remove({
				key: 'Bank', // 注意:请不要在key中使用_下划线符号!
				id: 'BankData', 
			})
			
			this.props.logout();
			key = 'login';
		}
	
		Actions[key]({});
		
		if(item == 'transfer'){ 
			setTimeout(()=>{reloadPage(item) }, 100) 
			
		} 
		
	}
  

	loading(){
		 Toast.loading('数据加载中,请稍候...', 200);
	   } 

	   loadend(){
		Toast.hide();
	   }
	 
  render () { 
		
	const {LivechatDrag,payHtml,gametype} = this.state;
 
		window.ReloadLivechatDragType=()=>{
				this.setState({
					LivechatDrag:LivechatDrag == false? true:false
				})
		}

	 return (
			
				<View {...this._panResponder.panHandlers} style={[styles.circle, this.state.style]}>
					 
					{/* <TouchableOpacity style={{width: 20, height: 20,backgroundColor:'#000',borderRadius:10,left:55,paddingTop:1,paddingBottom:1 }} onPress={()=>this.props.OpenMenu()}>
					 
					   <Text style={{color:'#fff',textAlign:'center'}}>X</Text>
				 
					</TouchableOpacity>  */}

				   {LivechatDragType == true && 
					<Touch style={{width: CIRCLE_SIZE, height: CIRCLE_SIZE }} onPress={()=>this.OpenMenu()}>
					<Image source={require('./../images/cs.png')} resizeMode={'contain'} 
							style={{width: 40,height: 40}} />
					</Touch>
  				  }
				</View> 
			
    )
  }
}

const styles = StyleSheet.create({
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
       // borderRadius: CIRCLE_SIZE / 2,
        //backgroundColor: 'green',
        position: 'absolute',
    },
		menu:{
			left:0,
			top:0,
			width:width-60,
			height:height,
			backgroundColor: '#012c1f',
			position: 'absolute',

		},
		container: {
		    flex: 1,
		    padding: 0
				
		  },
		
		  button: {
				height:30,
		  },
			
			buttonB:{
				paddingTop:15,
				paddingBottom:15,
				borderLeftWidth: 1,
				backgroundColor: '#00633c',
				borderColor: '#013626'
			},
			widthSome:{
		        width:width - (13+42+5+45+11+18+10),
		    },
			fontText:{
				textAlign: 'center',
				color:"#fff",
		    fontSize: 16,
			},
			
			fontText2:{
				textAlign: 'left',
				paddingLeft:13,
				color:"#fff",
				fontSize: 14,
			},
			fontText3:{
				textAlign: 'center',
				color:"#fff",
				fontSize: 14,
			},
			
			MoneyBg:{
				opacity:0,
				backgroundColor: '#000',
				position: 'absolute', 
			},
			MenuXbox:{
			
				borderBottomWidth: 1,
				borderColor: '#012c1f',
				backgroundColor: '#013626',
				
			},
			MenuXd:{
				flex:0.9,
		    paddingTop:10,
		    paddingBottom:10,
			},
			MenuXdIcon:{
				flex:0.1,
			
			},
			MenuXc:{
			
				borderBottomWidth: 1,
				borderColor: '#013626'
				
			},
			MenuXb:{   //下拉選單樣式
				paddingTop:10,
				paddingBottom:10,
				paddingLeft:15,
				borderColor: '#485d57',
				borderBottomWidth: 1,
				backgroundColor: '#001f16'
				
			},
			
			iconMenu:{
				width:10,
				height:10,
				borderRadius:80,
				marginTop:4,
				backgroundColor: '#f6e4a6'
			},
			navHeader: {
				backgroundColor: '#00633c',
				paddingLeft:8,
				paddingRight:15,
				paddingTop:5,
				paddingBottom:5,
				borderBottomWidth: 1,
				borderColor: '#012c1f'
		  },
		
		  navMenu: {
		    backgroundColor:'#012c1f',
			},
			
			
			dowButton: {
				backgroundColor: '#00633c',
			
				borderBottomWidth: 1,
				borderColor: '#00633c'
			},
			
			dowButton2: {
				backgroundColor: '#013626',
				paddingTop:15,
				paddingBottom:15,
				paddingLeft:5,
				paddingRight:15,
				borderBottomWidth: 1,
				borderColor: '#012c1f'
			},
			
			
			NoticeText:{
		
			},
			userMoney:{  //menu 菜單
				width:width-60, 
				position: 'absolute', 
				zIndex:999,  
				top: Platform.OS === "android" ? 25 :35, 
				left: 0,
				borderRadius:4,
				backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.6,
		shadowRadius: 5,
		shadowColor: "#666",
		//注意：这一句是可以让安卓拥有灰色阴影
		elevation: 4,
		
			},


			userMoneyBox:{
				 padding:7,
				 borderBottomWidth: 1,
				 borderColor: '#444444',
				 
			}, 
		  userMoneyText:{
			  fontSize:13,
				color:"#2D2D2D"
			},
			
		
		
			userMoneybox1:{
				flex:0.4,
			},
			userMoneybox2:{
				flex:0.4,
				top:6,
			},
			userReload:{
				flex:0.1,
				top:1,
				borderLeftWidth: 1,
				borderColor: '#012c1f'
			},
			oneT:{ //一鍵轉帳
			flex:0.4,
			paddingTop:2,
			paddingLeft:4,
			paddingRight:4,
			paddingBottom:2,
			borderRadius:12,
			marginLeft:5,
			backgroundColor: '#10906D',
			},
			oneT2:{
		    flex:0.4,
		     paddingTop:2,
			paddingLeft:4,
			paddingRight:4,
			paddingBottom:2,
			borderRadius:12,
			marginLeft:5,
			}
			
}); 

export default(livechatDragHoliday);



