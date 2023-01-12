import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Touch from "react-native-touch-once";
const {
  width, height
} = Dimensions.get('window')
//本银
export const LBPrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title]}>乐天使温馨提醒：</Text>
      <View style={styles.list}>
        <Text style={[styles.num]}>1.</Text>
        <Text style={[styles.content]}>
          请务必按照系统提示的银行及金额进行存款，否则您的存款将无法及时到账。
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>2.</Text>
        <Text style={[styles.content]}>
          存款后，点击【我已成功存款】耐心等待到账，为了保证及时到账，请勿重复提交存款信息。
        </Text>
      </View>
    </View>
  );
};

//支付宝转账
export const ALBPrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title]}> 乐天使温馨提醒：</Text>
      <View style={styles.list}>
        <Text style={[styles.num]}>1.</Text>
        <Text style={[styles.content]}>
          存款后，点击【我已成功存款】耐心等待到账，为了保证及时到账，请勿重复提交存款信息。
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>2.</Text>
        <Text style={[styles.content]}>
          请务必按照系统提示的银行及金额进行存款，否则您的存款将无法及时到账。
        </Text>
      </View>
    </View>
  );
};
//京东钱包
export const JDPPrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      {/* <View style={{ borderRadius: 10, backgroundColor: '#EBEBED', padding: 10 }}>
                <Text style={{ color: '#666666', lineHeight: 20, fontSize: 12 }}>收款商户将会不定时变动，请在充值前到此页面提交申请获取最新二维码。存款过程中切勿重复扫码，多次扫码会导致系统记录异常而无法成功到账。</Text>
            </View>
            <View style={{ marginTop: 16 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#222222' }}>充值步骤：</Text>
                <View style={styles.list}>
                    <Text style={[styles.num]}>1.</Text>
                    <Text style={[styles.content]}>请输入充值金额点击 “提交”。</Text>
                </View>
                <View style={styles.list}>
                    <Text style={[styles.num]}>2.</Text>
                    <Text style={[styles.content]}>接着，使用手机 银联 APP 扫描二维码。并且在 5 分钟之内完成支付，否则二维码将失效无法进行支付。</Text>
                </View>
                <View style={styles.list}>
                    <Text style={[styles.num]}>3.</Text>
                    <Text style={[styles.content]}>扫描二维码后，银联 APP 将会显示付款信息点击“立即付款”继续付款过程。</Text>
                </View>
                <View style={styles.list}>
                    <Text style={[styles.num]}>4.</Text>
                    <Text style={[styles.content]}>输入确认支付密码再点击“完成”即可。一旦支付过程完成，银联 APP 将显示一个通知页面，以确认支付成功。</Text>
                </View>
                <Touch onPress={() => { LiveChatOpenGlobe() }} style={styles.list}>
                    <Text style={[styles.num]}>5.</Text>
                    <Text style={[styles.content]}> 如有问题请联系<Text style={{ color: '#1C8EFF', fontSize: 12 }}>在线客服</Text>。</Text>
                </Touch>
            </View> */}
    </View>
  );
};

//银联支付
export const UPPrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title]}> 乐天使温馨提醒：</Text>
      <View style={styles.list}>
        <Text style={[styles.num]}>1.</Text>
        <Text style={[styles.content]}>
          银联支付简易快捷，仅需两步即可完成：
        </Text>
      </View>
      <View style={[styles.list, { paddingLeft: 10 }]}>
        <Text style={[styles.content]}>a. 输入预存的金额提交</Text>
      </View>
      <View style={[styles.list, { paddingLeft: 10 }]}>
        <Text style={[styles.content]}>b. 扫描二维码成功支付</Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>2.</Text>
        <Text style={[styles.content]}>银联支付将收取手续费。</Text>
      </View>
    </View>
  );
};
//  qq
export const QQrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title]}> 乐天使温馨提醒：</Text>
      <View style={styles.list}>
        <Text style={[styles.num]}>1.</Text>
        <Text style={[styles.content]}>键入存款金额</Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>2.</Text>
        <Text style={[styles.content]}>
          点击提交后，页面下方会自动生成二维码(此二维码仅本次有效)
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>3.</Text>
        <Text style={[styles.content]}>
          使用手机打开QQ，扫描二维码转至付款页面
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>4.</Text>
        <Text style={[styles.content]}>确保信息无误提交即可</Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>5.</Text>
        <Text style={[styles.content]}>QQ支付到账时间为15分钟左右</Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>6.</Text>
        <Text style={[styles.content]}>QQ支付不支持信用卡存款</Text>
      </View>
    </View>
  );
};
//在线支付
export const BCPrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title]}> 乐天使温馨提醒：</Text>

      <View style={styles.list}>
        <Text style={[styles.num]}>1.</Text>
        <Text style={[styles.content]}>
          会员可使用您的银联卡，维萨卡(VISA)或万事达卡(MasterCard)进行存款。
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>2.</Text>
        <Text style={[styles.content]}>
          只需输入符合要求的存款金额，点击提交即可操作。{" "}
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>3.</Text>
        <Text style={[styles.content]}>到账时间通常约1-10分钟</Text>
      </View>
    </View>
  );
};

//網銀轉帳
export const PPBPrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title]}> 乐天使温馨提醒：</Text>
      <View style={styles.list}>
        <Text style={[styles.num]}>1.</Text>
        <Text style={[styles.content]}>
          转账时必须按照系统产生的银行账号和金额进行支付，并且建议您上传存款凭证，以利及时到账。
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>2.</Text>
        <Text style={[styles.content]}>
          收款账户不接受【微信】、【支付宝】及【云闪付】等APP转账，以上方式将导致存款无法到账。{" "}
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>3.</Text>
        <Text style={[styles.content]}>
          银行账号会不定期更换，请确保您使用的是存款页面上最新的账号，再进行转账。
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>4.</Text>
        <Text style={[styles.content]}>如有任何问题请联系在线客服。 ​</Text>
      </View>
    </View>
  );
};

//在线支付宝
export const OAPrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title]}> 乐天使温馨提醒：</Text>
      <View style={styles.list}>
        <Text style={[styles.num]}>1.</Text>
        <Text style={[styles.content]}>输入存款金额点击提交。</Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>2.</Text>
        <Text style={[styles.content]}>
          打开支付宝，点击扫一扫完成支付即可。
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>3.</Text>
        <Text style={[styles.content]}>
          使用在线支付宝和京东支付扫码存款时，请不要保留二维码后进行多次扫码存款，以免出现延迟到账的现象，谢谢您的配合。
        </Text>
      </View>
    </View>
  );
};

//微转账
export const WCLBPrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title]}> 乐天使温馨提醒：</Text>
      <View style={styles.list}>
        <Text style={[styles.num]}>1.</Text>
        <Text style={[styles.content]}>
          每日晚上10:00PM-凌晨1:00AM(GMT+)将进行列行维修，期间建议您使用其他存款方式。
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>2.</Text>
        <Text style={[styles.content]}>
          请务必按照系统提示的银行及金额进行存款，否则您的存款将无法及时到账。
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>3.</Text>
        <Text style={[styles.content]}>
          刹那迟疑，后会无期！微信转账免手续费
        </Text>
      </View>
    </View>
  );
};
//微支付
export const WCPrompt = (item) => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title]}> 乐天使温馨提醒：</Text>
      <View style={styles.list}>
        <Text style={[styles.num]}>1.</Text>
        <Text style={[styles.content]}>
          v信支付简易快捷，仅需要两步即可完成！
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={{ fontSize: 12, lineHeight: 20, paddingLeft: 20 }}>
          a. 输入预存金额提交{" "}
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={{ fontSize: 12, lineHeight: 20, paddingLeft: 20 }}>
          b. 进入v信确认金额，输入支付密码即可成功支付
        </Text>
      </View>
      {item.item != "WeChatH5_LC" && (
        <View style={styles.list}>
          <Text style={[styles.num]}>2.</Text>
          <Text style={[styles.content]}>
            【限时优惠】刹那迟疑，后会有期！乐天堂v信支付免手续费.
          </Text>
        </View>
      )}
    </View>
  );
};

//AstroPay
export const APPrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title]}> 乐天使温馨提醒：</Text>
      <View style={styles.list}>
        <Text style={[styles.num]}>1.</Text>
        <Text style={[styles.content]}>
          AstroPay卡是一种充值预付卡，在淘宝等网站均有出售不同面值 Astropay卡。
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>2.</Text>
        <Text style={[styles.content]}>
          依次填写卡号、安全码、有效日期、卡片面值后点击提交。
        </Text>
      </View>
      <Touch
        onPress={() => {
          LiveChatOpenGlobe();
        }}
        style={styles.list}
      >
        <Text style={[styles.num]}>3.</Text>
        <Text style={[styles.content]}>
          如有问题请联系
          <Text style={{ color: "#00a6ff", fontSize: 12 }}>在线客服</Text>。
        </Text>
      </Touch>
    </View>
  );
};

//CC
export const CCPrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={[styles.title]}> 乐天使温馨提醒：</Text>
      <Text style={[styles.content]}>
        乐卡是一种充值预付卡，通过第三方平台轻松购买(乐卡)，无需激活，无需透露个人银行资料.
        一般到帐时间约15分钟 使用乐卡存款更方便快捷.
        如果您想了解更多关于乐卡的存款或购买详情, 欢迎咨询
      </Text>
      <Text style={[styles.content]}>依照以下3个简单的步骤即可存上：</Text>
      <View style={styles.list}>
        <Text style={[styles.num]}>1.</Text>
        <Text style={[styles.content]}>从乐天堂指定合作伙伴购买乐。</Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>2.</Text>
        <Text style={[styles.content]}>
          确保乐卡的货币与乐天堂账户上的保持一致。
        </Text>
      </View>
      <View style={styles.list}>
        <Text style={[styles.num]}>3.</Text>
        <Text style={[styles.content]}>输入正确的乐卡序列号和密码。</Text>
      </View>
    </View>
  );
};

//SR
export const SRPrompt = () => {
  return (
    <View style={{ marginTop: 30 }}>
      <Text style={[styles.title]}> 乐天使温馨提醒：</Text>
      <View style={styles.list}>
        <Text style={{ width: 18, color: '#999' }}>1.</Text>
        <Text style={styles.listText}>只允许本地银行进行交易，请按照银行账户信息进行存款，请必须以选定的金额存款，否则将无法到账。</Text>
      </View>
      <View style={styles.list}>
        <Text style={{ width: 18, color: '#999' }}>2.</Text>
        <Text style={styles.listText}>必须在30分钟内转账，若30分钟内未完成，交易将被拒绝，若在30分钟后交易，金额将不予退还。</Text>
      </View>
      <View style={styles.list}>
        <Text style={{ width: 18, color: '#999' }}>3.</Text>
        <Text style={styles.listText}>每次存款之前需先检查看最新的存款账号信息，避免存款过程中出现错误导致您的权益受损。</Text>
      </View>
      <View style={styles.list}>
        <Text style={{ width: 18, color: '#999' }}>4.</Text>
        <Text style={styles.listText}>小额存款不支持一卡通或超级网银交易。</Text>
      </View>
    </View>
  )
}

//CTC
export const CTCPrompt = () => {
  return (
    <View style={{ marginTop: 16 }}>
      {/* <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#222222', lineHeight: 30 }}>温馨提示：</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#666666', lineHeight: 30 }}>使用 [泰达币] 充值方式的童鞋们请注意：</Text>
            <View style={styles.list}>
                <Text style={{ width: 18, paddingTop: 10 }}>1.</Text>
                <Text style={{ fontSize: 12, lineHeight: 20, paddingTop: 10 }}>泰达币充值方式暂时仅接受 <Text style={{ color: '#222', fontWeight: 'bold' }}>USDT 泰达币（USDT-ERC20）</Text>此货币进行交易，所以在您购买货币时请务必记得选择 <Text style={{ color: '#222', fontWeight: 'bold' }}>USDT 泰达币（USDT-ERC20）</Text>。</Text>
            </View>
            <View style={styles.list}>
                <Text style={{ width: 18, paddingTop: 10 }}>2.</Text>
                <Text style={{ fontSize: 12, lineHeight: 20, paddingTop: 10 }}><Text style={{ fontWeight: 'bold', color: '#222' }}>极速虚拟币</Text> - 这个支付渠道里所产生的二维码和收款地址都是您的专属收款地址，就像童鞋的银行账号一样，所以在您进行极速虚拟币充值时，务必输入小同给予您的专属收款地址于提币地址那一栏来进行交易哦。 </Text>
            </View>
            <View style={styles.list}>
                <Text style={{ width: 18, paddingTop: 10 }}>3.</Text>
                <Text style={{ fontSize: 12, lineHeight: 20, paddingTop: 10 }}><Text style={{ fontWeight: 'bold', color: '#222' }}>虚拟币支付</Text> - 这个支付渠道第三方的页面里，每次交易所产生的二维码和收款地址<Text style={{ color: '#F92D2D' }}>仅限一次使用</Text>。记住别重复使用哦，不然您的存款将无法到账哟。 </Text>
            </View>
            <View style={styles.list}>
                <Text style={{ width: 18, paddingTop: 10 }}>4.</Text>
                <Text style={{ fontSize: 12, lineHeight: 20, paddingTop: 10 }}>当您使用第三方平台购买 <Text style={{ color: '#222', fontWeight: 'bold' }}>USDT 泰达币（USDT-ERC20）</Text>时，部分平台会收取手续费，请参考以下例子<Text style={{ color: '#F92D2D' }}>（*若第三方平台更改手续费的数量，则以第三平台最新的手续费为准。）</Text>：</Text>
            </View>
            {
                item.CTCPromptActive % 2 == 0 &&
                <View style={{ paddingLeft: 20 }}>
                    <Text style={{ fontSize: 12, lineHeight: 20, paddingTop: 5 }}>a) <Text style={{ fontWeight: 'bold', color: '#222' }}>火币Huobi</Text> – 交易货币的总数量需要添加手续费 - 【大约】2.35 USDT-ERC20</Text>
                    <Text style={{ fontSize: 12, lineHeight: 20, paddingTop: 5 }}>如您想要充值15 USDT-ERC20的货币数量至小同，【若】手续费是2.35 USDT-ERC20，在您交易的数量那一栏则需要输入 17.35 USDT-ERC20, 到账至小同的数量则是 15 USDT-ERC20。</Text>
                    <Text style={{ fontSize: 12, lineHeight: 20, paddingTop: 5 }}>b) <Text style={{fontWeight: 'bold', color: '#222'}}>OKEx</Text> – 交易货币的总数量需要添加手续费 - 【大约】3 USDT-ERC20 </Text>
                    <Text style={{ fontSize: 12, lineHeight: 20, paddingTop: 5 }}>如您想要充值15 USDT-ERC20的货币数量至小同，【若】手续费是3 USDT-ERC20，在您交易的数量那一栏则需要输入 18 USDT-ERC20, 到账至小同的数量则是 15 USDT-ERC20。 </Text>
                    <Touch onPress={() => { Actions.CTCpage({actionType: 'Deposit'}) }}>
                        <Text style={{ fontSize: 12, lineHeight: 20, paddingTop: 5 }}>* 更多详情可<Text style={{color: '#1C8EFF'}}>查询充值教学</Text></Text>
                    </Touch>
                </View>
            }
            <Touch onPress={() => { item.CTCBack() }} style={styles.CTCtouchuBtn}>
                <Text style={{ color: '#666666', fontSize: 12 }}>{item.CTCPromptActive % 2 == 0 ? '收起内容' : '展开更多'}</Text>
            </Touch> */}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  num: {
    width: 18,
    fontSize: 12,
    color: "#999999",
    lineHeight: 20,
  },
  content: {
    fontSize: 12,
    lineHeight: 20,
    color: "#999999",
  },
  listText:{
    fontSize: 12,
    lineHeight: 20,
    color: '#999',
    width: width - 55,
  },
  CTCtouchuBtn: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    width: width - 30,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
