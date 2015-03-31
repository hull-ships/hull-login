import App from './components/app';

// This is the entry point for the Ship when it's used as an HTML Import.
// It's standalone and boots when Hull exists and calls onEmbed

// Yes. You can do this with Webpack.
// import MainStyles from './styles/main.scss';

//// Now you can embed CSS like this.
//// Gives you reference-counted files;
// MainStyles.use(document.getElementsByTagName('head')[0]);

//// To remove the style: 
// MainStyles.unuse();

if (Hull){
  // This is called when the ship has been embedded in the page.
  Hull.onEmbed(document, App);
}

module.exports=App
