import React             from 'react' ;
import AlbumsList        from './AlbumsList.jsx';
import AlbumImageList    from './AlbumImageList.jsx';

class MyApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {albums:[], selectedAlbum:null, selectedImage:null,index:null, receivedToken:false, myInit:{}, user:"", fetchingDataCompleted:false}
    
    this.showLargeThumbnail=this.showLargeThumbnail.bind(this);
    this.nextImageStateSetter   = this.nextImageStateSetter.bind(this);
    this.previousImageStateSetter = this.previousImageStateSetter.bind(this);
  }
  
  componentDidMount(){ 
     
     if (location.hash.length){
      this.setState({receivedToken:true}) 
     // code from https://api.imgur.com/oauth2
     var params = {}, queryString = location.hash.substring(1),
     regex = /([^&=]+)=([^&]*)/g, m;  
     while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}     
    var endOfToken      = queryString.indexOf("&expires_in");
    var Token           = queryString.slice(13,endOfToken);
    var startOfUserName = queryString.indexOf("&account_username")+ 18;
    var endOfUserName   = queryString.indexOf("&account_id");
    var userName        = queryString.slice(startOfUserName,endOfUserName);
    var authHeaderValue = "Bearer " + Token;
    
    var myInit = { method: 'GET', headers: {Authorization:authHeaderValue}};
    //-----------Get the User's Albums---------------------//
    fetch("https://api.imgur.com/3/account/" + userName +"/albums/",myInit)
        .then(response =>response.json())
        .then( response =>{ 
          this.setState({albums:response.data, myInit: myInit, user:userName})})
    
        //using the ids of the cover images of the albums get the links of these cover images
        
      .then( ()=>{ var promisesArray = this.state.albums.map( elem=>{ return ( fetch("https://api.imgur.com/3/image/"+elem.cover,this.state.myInit).then( res=> res.json()))})
        return Promise.all(promisesArray)})
        .then( jsonsArray => { 
        var albumCoverImagesArray = [];
        jsonsArray.forEach(elem=>{
        var newLink = elem.data.link.replace( elem.data.id, elem.data.id + "b" );
        albumCoverImagesArray.push({id:elem.data.id, link:newLink})}) 
        albumCoverImagesArray.forEach( albumCover=>{
          this.state.albums.forEach((album,index)=>{ if (albumCover.id===album.cover){
           var newAlbumAndCover = Object.assign({},album,{cover_link:albumCover.link}); 
           var newAlbums        = this.state.albums.slice();
           newAlbums[index]     = newAlbumAndCover
           this.setState({albums:newAlbums});  
          } } )
        } )
    })
        //using the ids of the albums of the user get the images of each seperate album
  .then( ()=>{ var promisesArray = this.state.albums.map( elem=>{ return (          fetch("https://api.imgur.com/3/album/"+elem.id,this.state.myInit).then( res=> res.json()) ) } )
     return Promise.all(promisesArray)
    } ).then(jsonsArray=>{
        var albumsImages = [];
        jsonsArray.forEach( albumWithImages=>{ albumsImages.push({albumId:albumWithImages.data.id, images:albumWithImages.data.images}) })
        albumsImages.forEach( albumImagesObject=>{ 
        this.state.albums.forEach( (album,index) => { if ( albumImagesObject.albumId=== album.id ){
        var newAlbumWithImages = Object.assign({},album,{images:albumImagesObject.images});
        var newAlbums          = this.state.albums.slice();
        newAlbums[index]       = newAlbumWithImages;
        this.setState({albums:newAlbums, fetchingDataCompleted:true});  
        } } )
        } )         
    }).catch(function catchAllErrors(error){console.log(error)})
     }
  }

  showLargeThumbnail(){
    if (window.screen.availWidth>860){
      console.log("big screen")
      var thumbnailUrl = this.state.selectedImage.link.replace( this.state.selectedImage.id, this.state.selectedImage.id + "h" );
    
    }
    else {
      var thumbnailUrl = this.state.selectedImage.link.replace( this.state.selectedImage.id, this.state.selectedImage.id + "l" );
    }
    return thumbnailUrl;
  }
  
  nextImageStateSetter(){
   var nextImage = (this.state.index + 1==this.state.selectedAlbum.images.length)
                    ? this.state.selectedAlbum.images[0]
                    : this.state.selectedAlbum.images[this.state.index+1]
   var indexOfNextImage=(this.state.index+1 ==this.state.selectedAlbum.images.length) 
                        ? 0 : this.state.index+1
   this.setState({selectedImage:nextImage, index:indexOfNextImage})
  }
  
   previousImageStateSetter(){
   var previousImage = (this.state.index == 0)
                    ? this.state.selectedAlbum.images[this.state.selectedAlbum.images.length -1 ]
                    : this.state.selectedAlbum.images[this.state.index - 1]
   var indexOfpreviousImage=(this.state.index ==0) 
                        ? this.state.selectedAlbum.images.length -1 : this.state.index-1
   this.setState({selectedImage:previousImage, index:indexOfpreviousImage})
  }
  
  
  render(){
    
      if (this.state.selectedImage){
    return(
      <div id="MyApp" className="container">
      <div className="buttonGroupWrapper" style={{marginTop:20, marginBottom:20}}>
       
        <button className="btn-group btn-primary btn-lg"   onClick={()=>{ this.previousImageStateSetter() }}>&lt;</button>
        <button className="btn-group btn-primary btn-lg" style={{marginLeft:10, marginRight:10}} onClick={()=>{this.setState({selectedImage:null})}}>Album</button>
       <button className="btn-group btn-primary btn-lg"   onClick={()=>{ this.nextImageStateSetter() }}>&gt;</button>
        
      </div>  
        <img className="img img-responsive center-block" src={this.showLargeThumbnail()}/>
      </div>
    )
    }
     else  if (this.state.selectedAlbum){
    return(
      <div id="MyApp" className="container">
        <div style={{display:"flex", justifyContent:"center"}}>
        <button className="btn btn-primary btn-lg margin" onClick={()=>{this.setState({selectedAlbum:null})}}>Back to All Albums</button>
        </div>
        <AlbumImageList 
        images={this.state.selectedAlbum.images} 
        onImageSelect ={ (selectedImage, index)=>this.setState({selectedImage, index}) } />
      </div>
    )
    }
    else if (this.state.receivedToken && this.state.fetchingDataCompleted){
    return(
      <div id="MyApp" className="container">
       <AlbumsList 
         onAlbumSelect={selectedAlbum=>{
            this.setState({selectedAlbum})
          }}
         albums={this.state.albums}/>
      </div>
    )
    }
        else if (this.state.receivedToken){
    return(
      <div className = "myWrapper container">
      
       <h4 className="text-center" style={{marginTop:"7em"}}>Loading... </h4>
      </div>
    )
    }
    
    else{
      return(
        <div className = "myWrapper container">
        <div className="row spacer"></div>
        <a id="link" href="https://api.imgur.com/oauth2/authorize?client_id=01243e9e1554987&response_type=token">
        <button className="btn btn-warning btn-lg center-block">Get my Imgur Albums</button>
        </a>
        </div>
      );
    }
    
  }
}

export default MyApp;