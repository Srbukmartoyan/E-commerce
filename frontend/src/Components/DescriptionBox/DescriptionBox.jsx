import { useState } from "react"
import "./DescriptionBox.css"


const DescriptionBox = ({product}) => {
    const review = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non labore voluptatum ullam facilis consequuntur pariatur aliquam? Iste sit esse neque quasi consequatur animi ab molestiae deserunt omnis, illum, error quia tempore sed dolores rerum nobis unde voluptatum eveniet nihil laboriosam repudiandae asperiores! Optio placeat aspernatur quasi rem excepturi earum sunt.'
    const [state, setState] = useState(review);
    return (
        <div className="descriptionbox">
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box" onClick={() => {
                    setState(product.name)
                }}>Description</div>
                <div className="descriptionbox-nav-box fade" onClick={() => {
                    setState(review)
                }}>Reviews (122)</div>
            </div>
            <div className="descriptionbox-description">
                <p>{state}</p>
            </div>
        </div>
    )
}

export default DescriptionBox