FROM openjdk:17-slim-bullseye
WORKDIR /app
COPY target/TeamFinder-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
