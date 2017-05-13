import React           from 'react' ;

class Album extends React.Component{
  constructor(props){
    super(props);      
  }
  
  
  render(){
    return(
      <div className="grid-item" 
          onClick={ ()=>{
          this.props.onAlbumSelect(this.props.album)}}>
       <div className="panel">
        <img className="img-thumbnail" src={this.props.album.cover_link} />
        <h4 className="text-center">{this.props.album.title}</h4>
       </div>
      </div>
      
    );
  }
}

export default Album;