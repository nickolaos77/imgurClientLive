import React           from 'react' ;

class Image extends React.Component{
  constructor(props){
    super(props);      
  }
  
  render(){
    return(
      <div className="grid-item" 
           onClick={ ()=>{
          this.props.onImageSelect(this.props.image)}}>
       <div className="panel">
        <img className="img-thumbnail" src={this.props.thumbnailUrl} />
        <h4 className="text-center"></h4>
       </div>
      </div>
    );
  }
}

export default Image;