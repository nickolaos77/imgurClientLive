import React           from 'react' ;
import Image           from './Image.jsx';

class AlbumImageList extends React.Component{
  constructor(props){
    super(props);  
    this.renderImages = this.renderImages.bind(this);
  }
  
  renderImages(){
    return  this.props.images.map((image,idx)=>{
      //the thumbnailUrl points to the imgur thubnail
      var thumbnailUrl = image.link.replace( image.id, image.id + "b" );
      return ( <Image 
      onImageSelect={this.props.onImageSelect}
      key          ={idx} 
      index        = {idx}
      thumbnailUrl = {thumbnailUrl}  
      image        = {image}/>)} )
  }
    
  render(){
    return(
      <div className="row" id="albumsList">
        {this.renderImages()}
      </div>
    );
  }
}
export default AlbumImageList;