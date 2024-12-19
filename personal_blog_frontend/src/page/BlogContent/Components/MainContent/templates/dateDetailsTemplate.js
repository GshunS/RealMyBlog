const getRandomColor = () => {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const getDateDetailsTemplate = (formattedDate) => ({
    "type": "details",
    "attrs": {
        "open": true
    },
    "content": [
        {
            "type": "detailsSummary",
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "textStyle",
                            "attrs": {
                                "fontSize": null,
                                "color": getRandomColor()
                            }
                        }
                    ],
                    "text": formattedDate
                }
            ]
        },
        {
            "type": "detailsContent",
            "content": [
                {
                    "type": "details",
                    "attrs": {
                        "open": false
                    },
                    "content": [
                        {
                            "type": "detailsSummary",
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "textStyle",
                                            "attrs": {
                                                "fontSize": null,
                                                "color": getRandomColor()
                                            }
                                        }
                                    ],
                                    "text": "bug修复"
                                }
                            ]
                        },
                        {
                            "type": "detailsContent",
                            "content": [
                                {
                                    "type": "paragraph"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "details",
                    "attrs": {
                        "open": false
                    },
                    "content": [
                        {
                            "type": "detailsSummary",
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "textStyle",
                                            "attrs": {
                                                "fontSize": null,
                                                "color": getRandomColor()
                                            }
                                        }
                                    ],
                                    "text": "ui变化"
                                }
                            ]
                        },
                        {
                            "type": "detailsContent",
                            "content": [
                                {
                                    "type": "paragraph"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "details",
                    "attrs": {
                        "open": false
                    },
                    "content": [
                        {
                            "type": "detailsSummary",
                            "content": [
                                {
                                    "type": "text",
                                    "marks": [
                                        {
                                            "type": "textStyle",
                                            "attrs": {
                                                "fontSize": null,
                                                "color": getRandomColor()
                                            }
                                        }
                                    ],
                                    "text": "功能更新"
                                }
                            ]
                        },
                        {
                            "type": "detailsContent",
                            "content": [
                                {
                                    "type": "paragraph"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}); 