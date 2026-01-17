package com.project.TeamFinder.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.stream.Collectors;

import com.project.TeamFinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ImageHandlerService {

    private final UserRepository userRepository;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service_key}")
    private String serviceKey;

    ImageHandlerService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String uploadFile(File file, String bucketName, String fileName) throws IOException {

        System.out.println("Uploading file to Supabase Storage...");

        // Sanitize filename to remove special characters that might cause issues
        fileName = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");

        String urlString = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;
        System.out.println("Upload URL: " + urlString);
        System.out.println("File size: " + file.length() + " bytes");

        HttpURLConnection connection = (HttpURLConnection) URI.create(urlString).toURL().openConnection();
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);
        connection.setRequestProperty("Authorization", "Bearer " + serviceKey);
        connection.setRequestProperty("Content-Type", Files.probeContentType(file.toPath()));
        connection.setRequestProperty("x-upsert", "true");
        connection.setRequestProperty("Content-Length", String.valueOf(file.length())); // Good practice

        System.out.println("Connection established. Starting file upload...");

        // Write file data to output stream
        try (OutputStream os = connection.getOutputStream();
                FileInputStream fis = new FileInputStream(file)) {
            byte[] buffer = new byte[8192]; // Standard size
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
            os.flush(); // Ensure all data is sent
        }

        System.out.println("File upload request sent. Awaiting response...");

        // Check the response code
        int responseCode = connection.getResponseCode();
        System.out.println("Response Code: " + responseCode);
        System.out.println("Response Message: " + connection.getResponseMessage());

        if (responseCode == HttpURLConnection.HTTP_OK || responseCode == 201) {
            System.out.println("✅ Upload successful: " + responseCode);
            return "Upload successful: " + responseCode;
        } else {
            // ✅ CRITICAL: Read the error response body
            System.out.println("❌ Upload failed: " + responseCode);

            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(connection.getErrorStream()))) {
                String errorResponse = br.lines().collect(Collectors.joining("\n"));
                System.out.println("Error Response Body: " + errorResponse);
                return "Upload failed: " + responseCode + " - " + errorResponse;
            } catch (Exception e) {
                System.out.println("Could not read error stream: " + e.getMessage());
                return "Upload failed: " + responseCode;
            }
        }
    }

    private boolean fileExists(String bucketName, String fileName) {
        try {

            String url = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;
            HttpURLConnection connection = (HttpURLConnection) URI.create(url).toURL().openConnection();
            connection.setRequestMethod("HEAD");
            connection.setRequestProperty("Authorization", "Bearer " + serviceKey);

            int responseCode = connection.getResponseCode();
            return responseCode == HttpURLConnection.HTTP_OK; // File exists if response is 200
        } catch (IOException e) {
            // Handle exceptions (e.g., URL not found, connection issues)
            System.err.println("Error checking file existence: " + e.getMessage());
            return false; // Assume file does not exist on error
        }
    }

    public String deleteFile(String bucketName, String fileName) throws IOException {
        String url = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;
        HttpURLConnection connection = (HttpURLConnection) URI.create(url).toURL().openConnection();
        connection.setRequestMethod("DELETE");
        connection.setRequestProperty("Authorization", "Bearer " + serviceKey);
        
        
        int responseCode = connection.getResponseCode();
        System.out.println("Delete Response Code: " + responseCode);
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(connection.getErrorStream()))) {
            String errorResponse = br.lines().collect(Collectors.joining("\n"));
            System.out.println("Error Response Body: " + errorResponse);
            return "Upload failed: " + responseCode + " - " + errorResponse;
        } catch (Exception e) {
            System.out.println("Could not read error stream: " + e.getMessage());
            return "Upload failed: " + responseCode;
        }
        // if (responseCode == HttpURLConnection.HTTP_NO_CONTENT) {
        // return "File deleted successfully";
        // } else {
        // throw new IOException("Failed to delete file: " +
        // connection.getResponseMessage());
        // }
    }

    public byte[] getFile(String bucketName, String fileName) throws IOException {
        String url = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;

        HttpURLConnection connection = (HttpURLConnection) URI.create(url).toURL().openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Authorization", "Bearer " + serviceKey);

        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            InputStream inputStream = connection.getInputStream();
            return inputStream.readAllBytes();
        } else {
            throw new IOException("Failed to retrieve file: " + connection.getResponseMessage());
        }
    }

}