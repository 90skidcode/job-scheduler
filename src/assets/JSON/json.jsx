export const employee = [
    {
        "id": 1,
        "title": "Technician 1",
        "trained": "Hyundai",
        "workingHours": 14,
        "location": {
            "lat": 11.396439,
            "lng": 77.689394
        },
        "drivingTime": 6,
        "leave": false,
        "orders": [
            {
                "distanceDetails": {
                    "distance": {
                        "text": "10.4 km",
                        "value": 10368
                    },
                    "duration": {
                        "text": "14 mins",
                        "value": 839
                    },
                    "status": "OK",
                    "id": 0
                },
                "order": {
                    "id": 1,
                    "name": "Customer 1",
                    "serviceOn": "Hyundai",
                    "TimeToComplete": 1,
                    "processed": false,
                    "location": {
                        "lat": 11.445157,
                        "lng": 77.724629
                    },
                    "date": {
                        "year": "2023",
                        "month": [
                            4
                        ],
                        "week": [
                            4
                        ],
                        "days": [
                            0
                        ],
                        "time": [
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14
                        ]
                    },
                    "exactDate": [
                        {
                            "startTime": "2023-04-16T08:00:00+05:30",
                            "endTime": "2023-04-16T14:59:00+05:30"
                        }
                    ],
                    "startTime": "2023-04-16T08:00:00+05:30",
                    "endTime": "2023-04-16T14:59:00+05:30"
                },
                "eventTime": {
                    "startTime": "2023-04-16T07:46:01+05:30",
                    "endTime": "2023-04-16T09:09:14+05:30"
                }
            },
            {
                "distanceDetails": {
                    "distance": {
                        "text": "17.6 km",
                        "value": 17550
                    },
                    "duration": {
                        "text": "28 mins",
                        "value": 1678
                    },
                    "status": "OK",
                    "id": 0
                },
                "order": {
                    "id": 2,
                    "name": "Customer 2",
                    "serviceOn": "Hyundai",
                    "TimeToComplete": 1,
                    "processed": false,
                    "location": {
                        "lat": 11.34328,
                        "lng": 77.728451
                    },
                    "date": {
                        "year": "2023",
                        "month": [
                            4
                        ],
                        "week": [
                            4
                        ],
                        "days": [
                            0
                        ],
                        "time": [
                            14,
                            15,
                            16,
                            17
                        ]
                    },
                    "exactDate": [
                        {
                            "startTime": "2023-04-16T14:00:00+05:30",
                            "endTime": "2023-04-16T17:59:00+05:30"
                        }
                    ],
                    "startTime": "2023-04-16T14:00:00+05:30",
                    "endTime": "2023-04-16T17:59:00+05:30"
                },
                "eventTime": {
                    "startTime": "2023-04-16T13:32:02+05:30",
                    "endTime": "2023-04-16T15:10:59+05:30"
                }
            }
        ]
    },
    {
        "id": 2,
        "title": "Technician 2",
        "trained": "Hyundai",
        "workingHours": 14,
        "location": {
            "lat": 11.362888,
            "lng": 77.710357
        },
        "drivingTime": 6,
        "leave": false,
        "orders": [
            {
                "distanceDetails": {
                    "distance": {
                        "text": "25.5 km",
                        "value": 25477
                    },
                    "duration": {
                        "text": "33 mins",
                        "value": 1953
                    },
                    "status": "OK",
                    "id": 1
                },
                "order": {
                    "id": 3,
                    "name": "Customer 3",
                    "serviceOn": "Hyundai",
                    "TimeToComplete": 1,
                    "processed": false,
                    "location": {
                        "lat": 11.455204,
                        "lng": 77.815336
                    },
                    "date": {
                        "year": "2023",
                        "month": [
                            4
                        ],
                        "week": [
                            4
                        ],
                        "days": [
                            0
                        ],
                        "time": [
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14
                        ]
                    },
                    "exactDate": [
                        {
                            "startTime": "2023-04-16T08:00:00+05:30",
                            "endTime": "2023-04-16T14:59:00+05:30"
                        }
                    ],
                    "startTime": "2023-04-16T08:00:00+05:30",
                    "endTime": "2023-04-16T14:59:00+05:30"
                },
                "eventTime": {
                    "startTime": "2023-04-16T07:27:27+05:30",
                    "endTime": "2023-04-16T09:11:34+05:30"
                }
            }
        ]
    },
    {
        "id": 3,
        "title": "Technician 3",
        "trained": "Ford",
        "workingHours": 14,
        "location": {
            "lat": 10.462332,
            "lng": 78.398936
        },
        "drivingTime": 6,
        "leave": false,
        "orders": []
    },
    {
        "id": 4,
        "title": "Technician 4",
        "trained": "Tata",
        "workingHours": 14,
        "location": {
            "lat": 10.472332,
            "lng": 77.290875
        },
        "drivingTime": 6,
        "leave": false,
        "orders": []
    }
];


export const order = [{
    "id": 1,
    "name": "Customer 1",
    "serviceOn": "Hyundai",
    "TimeToComplete": 1,
    "processed": true,
    "location": {
        "lat": 11.445157,
        "lng": 77.724629
    },
    date: {
        'year': '2023',
        'month': [4],
        'week': [4],
        'days': [0],
        'time':[8,9,10,11,12,13,14]
    }
}, {
    "id": 2,
    "name": "Customer 2",
    "serviceOn": "Hyundai",
    "TimeToComplete": 1,
    "processed": true,
    "location": {
        "lat": 11.343280,
        "lng": 77.728451
    },
    date: {
        'year': '2023',
        'month': [4],
        'week': [4],
        'days': [0],
        'time':[14,15,16,17]
    }
}, {
    "id": 3,
    "name": "Customer 3",
    "serviceOn": "Hyundai",
    "TimeToComplete": 1,
    "processed": true,
    "location": {
        "lat": 11.455204,
        "lng": 77.815336
    },
    date: {
        'year': '2023',
        'month': [4],
        'week': [4],
        'days': [0],
        'time':[8,9,10,11,12,13,14]
    }

}, {
    "id": 4,
    "name": "Customer 4",
    "serviceOn": "Hyundai",
    "TimeToComplete": 2,
    "processed": false,
    "location": {
        "lat": 11.416670,
        "lng": 77.727128
    },
    date: {
        'year': '2023',
        'month': [4],
        'week': [2],
        'days': [3, 6],
        'time':[8,9,10,11,12,13,14]
    }
}];