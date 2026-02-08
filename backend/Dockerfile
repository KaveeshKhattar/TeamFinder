# FROM eclipse-temurin:17-jdk-alpine
# WORKDIR /app
# COPY target/TeamFinder-0.0.1-SNAPSHOT.jar app.jar
# ENTRYPOINT ["java", "-jar", "app.jar"]


# ============================================
# STAGE 1: Build the JAR
# ============================================
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first (for better caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the JAR
RUN mvn clean package -DskipTests -B

# ============================================
# STAGE 2: Run the JAR
# ============================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Switch to non-root user
USER spring:spring

# Expose port
# EXPOSE 8080

# Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]