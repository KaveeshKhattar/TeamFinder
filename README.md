# TeamFinder

This platform's purpose:

- to connect individuals with teams that have room for more members
- to help teams looking for prospective members be proactive and search for interested people

OR

1. **Individuals seeking teams** based on skills or acquaintances.
2. **Teams looking for members** with specific skills or connections


## Origin Story
The inspiration for building TeamFinder came from a personal experience during my college days.

- I once planned to participate in a hackathon hosted by my college.

- But my close friends were either out of town or uninterested in joining. 

- Discouraged by the lack of a team, I ended up not going. 

- Only to later realize that some of my high school acquaintances had attended with teams smaller than the allowed size.

## Installation

To run the backend service head to the root folder (backend/)

```bash
docker run --env-file ../.env -p 8080:8080 teamfinder-app
```

To run the frontend service head to the root folder (frontend/teamfinder-frontend)

```bash
npm run dev
```

### Configuration (template)

- SPRING_DATASOURCE_URL=jdbc:postgresql://<URL>
- SPRING_DATASOURCE_USERNAME=postgres.<username>
- SPRING_DATASOURCE_PASSWORD=
- security.jwt.secret-key=''
- security.jwt.expiration-time=1800000
- security.jwt.refresh-token-expiration-time=1296000000
- SUPPORT_EMAIL=''
- APP_PASSWORD=''

###

TeamFinder aims to ensure that no one misses out on valuable opportunities just because they couldn’t form a team with people within their friend group.

### Contact

Feel free to reach out to me at kaveeshkhattar@gmail.com to discuss more about this project.
