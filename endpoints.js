import { REQUERIMIENTO} from '../utils.js';

export const endpoints = [{
                    tipo: "soap",
                    urlbase: "http://mysite.com",
                    endpoint: "/itinerary/look",
                    name: "itinerary ",
                    headers: {
                      "Authorization": "Basic U0SSS4R434TTR4msqMTE1",
                      "Content-Type": "application/xml"
                    },
                    body: `<?xml version='1.0'?><e:Envelope xmlns:e="http://www.w3.org/2003/05/soap-envelope"><e:Header><a:reservation xmlns:a="http://travelcompany.example.org/reservation" e:role="http://www.w3.org/2003/05/soap-envelope/role/next"><a:reference>uuid:093a2da1</a:reference><a:dateAndTime>2007-11-29T13:20:00.000-05:00</a:dateAndTime></a:reservation><b:passenger xmlns:b="http://mycompany.example.com/employees" e:role="http://www.w3.org/2003/05/soap-envelope/role/next"><b:name>Fred Bloggs</b:name></b:passenger></e:Header><e:Body><c:itinerary xmlns:c="http://travelcompany.example.org/reservation/travel"><c:departure><c:departing>New York</c:departing><c:arriving>Los Angeles</c:arriving><c:departureDate>2007-12-14</c:departureDate><c:departureTime>late afternoon</c:departureTime><c:seatPreference>aisle</c:seatPreference></c:departure><c:return><c:departing>Los Angeles</c:departing><c:arriving>New York</c:arriving></c:return></c:itinerary></e:Body></e:Envelope>`,
                    check_body: 'responseCode>ART</responseCode',
                    peso:1,
                    sla: 2000
                  },
                  {
                    tipo: "rest",
                    urlbase: "http://mysite.com",
                    endpoint: "/rest-api/cards/accounts",
                    name: "cards_accounts",
                    headers: {
                      "Authorization": "Basic ddewddRNSU46UmVkbGwdyMD45",
                      "IdRequerimiento":`${REQUERIMIENTO()}`,
                      "Content-Type": "application/json"
                    },
                    body: `{"fiid":"APR","EntryKeyType":"3","input parameter":"R54EE62009"}`,
                    check_body: 'personaldata',
                    peso:1,
                    sla: 2000
                  },
                  {
                    tipo: "rest",
                    urlbase: "http://mysite.com",
                    endpoint: "/rest-api/cards/state",
                    name: "cards_state",
                    headers: {
                      "Authorization": "Basic TElOEDyt66540POURNSU46UmVkbMDI1",
                      "IdRequerimiento": `${REQUERIMIENTO()}`,
                      "Content-Type": "application/json"
                    },
                    body: `{"card":"123","pan":"65654434346"}`,
                    check_body: 'code',
                    peso:1,
                    sla: 2000
                  }]

