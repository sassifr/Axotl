import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import {Redirect, Link} from 'react-router-dom'


const Hackathon = ({hackathon}) => {
    let i = 0;
    const onClick = (e) => {
        return <Redirect to= {`/hackathon/${hackathon._id}`} />
    }
    return(
       <div className = "hackathon-item" onClick = {e => onClick(e)}>
           <div className= "hackathon-content">
                <h1>Title: {hackathon.title}</h1>

                <p className = "description"> {hackathon.description}</p>
                {hackathon.website ? <p className = "website">{hackathon.website}</p> : <p>Organizer didn't link their website!</p>}
                <p>Display pls</p>
                {hackathon.donations.map(donation =>(
                   donation.received.length > 0 ?
                            donation.received.map(received_singular => (
                                <p key = {i++}>Received {received_singular.type} : {received_singular.description}</p>
                            ))
                            :
                            <Fragment></Fragment>
                ))}
                <p>Location : {hackathon.location}</p>
                <p>Start Date: <Moment format = 'MM/DD/YYYY'>{hackathon.startDate}</Moment></p>

                <p>End Date: <Moment format = 'MM/DD/YYYY'>{hackathon.endDate}</Moment></p>
                <Link to={`/hackathon/${hackathon._id}`} className="btn btn-primary">
          View Hackathon
        </Link>
           </div> 

       </div> 
    )
}

Hackathon.propTypes = {
    hackathon: PropTypes.object.isRequired
}

export default Hackathon;