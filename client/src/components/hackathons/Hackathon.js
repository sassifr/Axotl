import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';


const Hackathon = ({hackathon}) => {
    return(
       <div className = "hackathon-item">
           <div className= "hackathon-content">
                <h1>Title: {hackathon.title}</h1>

                <p className = "description"> {hackathon.description}</p>
                {hackathon.website ? <p className = "website">{hackathon.website}</p> : <p>Organizer didn't link their website!</p>}

                <p>Start Date: <Moment format = 'MM/DD/YYYY'>{hackathon.startDate}</Moment></p>

                <p>End Date: <Moment format = 'MM/DD/YYYY'>{hackathon.endDate}</Moment></p>
           </div>

       </div> 
    )
}

Hackathon.propTypes = {
    hackathon: PropTypes.object.isRequired
}

export default Hackathon;