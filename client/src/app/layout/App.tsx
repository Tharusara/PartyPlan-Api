import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Weather, Locations } from '../models/Weather';
import NavBar from './NavBar';
import { Container, Grid, Button, Item, Card, Label, Segment, Image } from 'semantic-ui-react';
import ActivityForm from './ActivityForm';


function App() {

  const [activities, setPicnicDate] = useState([]);
  const [locations, setLocations] = useState<Locations[]>([]);
  const [selectedDate, setSelectedDate] = useState<Weather | undefined>(undefined);

  useEffect(() => {
      axios.get<Weather[]>('http://localhost:3001/party_plan?from=2020-10-01&to=2020-10-06&locations=Aachen&locations=berlin&locations=L%C3%B6rrach').then(response => {
        setPicnicDate(response.data);
      })
      axios.get<Locations[]>('/cities.json').then(response => {
        setLocations(response.data);
      })
  }, [])

  function sendData(activity?: Weather, cities?: any[]) { 
    let queryparm = [];
    for (let name of cities) {
      name = '&locations='+name
      queryparm.push(name)
    } 
    let queryForLocations = queryparm.toString().replaceAll(',', '')
    // if(queryForLocations.search("&locations=&") === 0){
    //   queryForLocations = queryForLocations.replaceAll('&locations=', '')
    // }  
    axios.get<Weather[]>(`http://localhost:3001/party_plan?from=${activity.fromDate || '2020-10-01'}&to=${activity.toDate || '2020-10-06'}${queryForLocations || '&locations=berlin'}`).then(response => {
        setPicnicDate(response.data);        
      })      
  }

  function handleFormOpen(id?: string) {
      console.log(id);
  }

  function handleSelectActivity(id: string) {
    console.log(id);
  }

  function handleFormClose() {
    console.log(false);  
    setSelectedDate(null) 
  }

  function handleCreateOrEditActivity(activity: Weather, cities?: any[]) {
      sendData(activity, cities)
  }

  return (
    <div>
      <NavBar openForm={handleFormOpen} />
      <Container style={{marginTop: '7em'}}>        
        <Grid>
            <Grid.Column width='6'>                                 
                <ActivityForm closeForm={handleFormClose} activity={selectedDate} locations={locations} createOrEdit={handleCreateOrEditActivity} />
            </Grid.Column>
            <Grid.Column width='10'>
                <Segment>
                    <Item.Group divided>                      
                        {activities.length ? activities.map(activity => (
                            <Item key={1}>
                                <Item.Content>
                                    <Item.Header as='a'>{activity.city}</Item.Header>
                                    <Image src="/assets/categoryImages/travel.jpg" />
                                    <Item.Meta>{ <b>{activity.date}</b>}</Item.Meta>
                                    <Item.Description>
                                        <div>sunshine : {activity.weather.sunshine} 'C 🔆</div>
                                        <div>wind speed :〽 {activity.weather.wind_speed} 💨, temperature: {activity.weather.temperature} 📛</div>
                                    </Item.Description>
                                    <Item.Extra>
                                        <Button onClick={() => handleSelectActivity(activity.weather.condition)} floated='right' content='Like' color='blue' />
                                        <Button onClick={() => handleSelectActivity(activity.weather.condition)} floated='right' content='Dislike' color='red' />
                                        <Label basic content={"🟠 "+ activity.weather.icon+" 💥"} />
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        )) 
                          :
                          <Card fluid>
                            <Card.Content>
                                <Card.Header>💨 No date is available due to bad weather ❗</Card.Header>
                                <Image src="/assets/categoryImages/travel.jpg" />
                                <Card.Meta>
                                  try again
                                </Card.Meta>
                                <Card.Description>
                                  search for a different location or diferent date range and
                                </Card.Description>
                            </Card.Content>
                        </Card> 
                        }
                    </Item.Group>
                </Segment>
            </Grid.Column>            
        </Grid>
      </Container>
    </div>
  );
}

export default App;