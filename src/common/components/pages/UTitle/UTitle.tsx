import React from 'react';

const uTitleStyle: React.CSSProperties = {
    color: '#333',
    fontSize: '17px',
    textAlign: 'center',
    margin: '10px 0',
    lineHeight: '46px',
    borderBottom: '1px #888 solid',
    padding: '0',
};

export function UTitle(props: {
    title: string;
}) {
    return (
        <h1 style={uTitleStyle}>{props.title}</h1>
    );
}
