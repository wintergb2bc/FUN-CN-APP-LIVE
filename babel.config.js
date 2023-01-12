const plugins = [
	"@babel/plugin-proposal-optional-chaining",
	["module-resolver", {
		"root": ["./"],
		"extensions": [".js", ".ios.js", ".android.js"],
		"alias": {
			"$LIB": "./src/lib",
			"$SBLIB": "./src/containers/SbSports/lib",
			"@": "./src"
		}
	}]
];
if (process.env.NODE_ENV === 'production') {
	plugins.push("transform-remove-console")
}

module.exports = {
	presets: ["module:metro-react-native-babel-preset"],
	plugins
};
