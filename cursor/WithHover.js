import { useState, useContext, useEffect } from 'react';
import CursorContext from './Context';

import { getRelativePosition } from './utils';

export default (Component, type) => ({passThroughRef, ...props}) => {
    const context = useContext(CursorContext);
    const { currentElement, pos, elementType } = context;
    const [ hovering, setHovering ] = useState(false);

    const handleMouseEnter = e => {
        if (!context.setCurrentElement) return;
        context.setCurrentElement(e.target, type);
        setHovering(true);
    }
    const handleMouseLeave = ({pageX, pageY, ...e}) => {
        if (!context.removeCurrentElement) return;
        context.removeCurrentElement()
        setHovering(false);
    }

    let styles;
    if (hovering && currentElement) {
        const amount = 2;
        const relativePos = getRelativePosition(pos, currentElement);
        const xMid = currentElement.offsetWidth / 2;
        const yMid = currentElement.offsetHeight / 2;
        const xMove = (relativePos.x - xMid) / currentElement.offsetWidth * amount;
        const yMove = (relativePos.y - yMid) / currentElement.offsetHeight * amount;

        if (elementType == "block") {
            styles = {
                transform: `translate(${xMove}px, ${yMove}px)`,
            }
        }
    }

    return <Component
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={styles}
        ref={passThroughRef}
        {...props}
    />
}