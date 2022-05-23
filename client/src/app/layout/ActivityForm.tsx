import React, { ChangeEvent, useState, useEffect } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Locations, Weather } from '../models/Weather';

interface Props {
    activity: Weather | undefined;
    locations: Locations[];
    closeForm: () => void;
    createOrEdit: (activity: Weather, cities?: any[]) => void;
}

export default function ActivityForm({activity: selectedActivity, locations, closeForm, createOrEdit}: Props) {

    const initialState = selectedActivity ?? {
        city: '',
        fromDate: '2020-10-01',
        toDate: '2020-10-03'
    }    
    useEffect(() => {
        fetchLocationNames();
      }, []);
    const [activity, setActivity] = useState(initialState);
    let [locationArray, setLocationArray] = useState<string[]>([]);
    let [selected, setSelectedArray] = useState<any[]>([]);

    function handleSubmit() {
        createOrEdit(activity, selected);
        setSelectedArray([]);
    }
    
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let {name, value} = event.target;
        if(!name){
            name = 'city'
            if(!value){
                value = event.target.outerText
                selected.push(event.target.outerText)
                setSelectedArray(selected)
            }
        }
        setActivity({...activity, [name]: value})
    }
    function fetchLocationNames(){
        let tempArray = [];
        for (let i = 0; i < locations.length; i++) {
            tempArray.push(locations[i].name);            
        }
        locationArray = tempArray;
        setLocationArray(locationArray)
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Dropdown multiple={true} fluid={true} placeholder='Pick a City' search={true} options={locations} selection name='city' onChange={handleInputChange.bind(this)} />
                <Form.Input type='date' placeholder='From' value={activity.fromDate} name='fromDate' onChange={handleInputChange} />
                <Form.Input  type='date' placeholder='To' value={activity.toDate} name='toDate' onChange={handleInputChange}/>
                <Button floated='right' positive type='submit' content='Check' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}