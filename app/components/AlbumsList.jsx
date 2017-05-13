import React           from 'react' ;
import Album           from './Album.jsx';

class AlbumsList extends React.Component{
  constructor(props){
    super(props);  
    this.renderAlbums = this.renderAlbums.bind(this);
  }
  
  renderAlbums(){
    return  this.props.albums.map((album,idx)=>{ return (
      <Album 
      onAlbumSelect={this.props.onAlbumSelect}
      key={idx} 
      album = {album}/>
    )} );
  }
    
  render(){
    return(
      <div className="row" id="albumsList">
        {this.renderAlbums()}
      </div>
    );
  }
}

export default AlbumsList;

