import React, { Component } from 'react';
import DefaultPfp from '../common/defaultpfp.png';
import DefaultSponsorPfp from '../common/sponsorDefault.png';
import { Link } from 'react-router-dom';


export default class Header extends Component {
    // constructor(props){
    //     super(props)
    // }
    render() {
        return (
        <div className="media">
            <img className="mr-3" src={this.props.sponsor ? DefaultSponsorPfp : DefaultPfp} style={{width: '200px', position: "relative", textalign: "center"}} alt= ""/>
            <div className="media-body">
                <h5 className="mt-0"><strong>@{this.props.handle}</strong></h5>
                <p>{this.props.bio}</p>
                <p className="mt-0">Organization: {this.props.organization}</p>
                <p className="mt-0">Location: {this.props.location}</p>
                {this.props.sponsor ? <Link to="/edit-sponsor-profile" className="btn btn-success">Edit Profile</Link>: <Link to="/edit-profile" className="btn btn-success">Edit Profile</Link>}
            </div>
        </div>
        )
    }
}
