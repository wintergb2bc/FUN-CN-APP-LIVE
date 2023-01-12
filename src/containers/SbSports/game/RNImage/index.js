import { Image } from "react-native";
import React from "react";

class RNImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDefault: true,
            showError: false,
        };
    }

    componentDidMount() { }

    componentWillUnmount() { }

    render() {
        // <Image defaultSource={defaultImg} resizeMode='stretch' source={{ uri: urls }} style={{ width: imgSize, height: imgSize }} />
        // 由於 defaultSource 在 android 不生效，用這個Component替代

        const defaultImg = this.props.defaultImg ? this.props.defaultImg : this.props.img;
        const errorImg = this.props.errorImg ? this.props.errorImg : this.props.defaultImg;
        const imgsrc = this.state.showDefault ? defaultImg : ( this.state.showError ? errorImg : this.props.img);
        return (
            <Image
                style={this.props.style}
                source={imgsrc}
                onLoadEnd={() => this.setState({showDefault: false})}
                onError={() => this.setState({showError: true})}
                resizeMode={this.props.resizeMode}
            />
        )
    }
}

export default RNImage
