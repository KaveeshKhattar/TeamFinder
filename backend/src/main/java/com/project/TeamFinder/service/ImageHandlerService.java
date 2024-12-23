package com.project.TeamFinder.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ImageHandlerService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service_key}")
    private String serviceKey;

    public String uploadFile(String email, File file, String bucketName, String fileName) throws IOException {

        if (fileExists(bucketName, fileName)) {
            // Optionally delete the existing file before uploading
            deleteFile(bucketName, fileName);
        }

        String urlString = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;
        HttpURLConnection connection = (HttpURLConnection) new URL(urlString).openConnection();
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);
        connection.setRequestProperty("Authorization", "Bearer " + serviceKey);
        connection.setRequestProperty("Content-Type", "application/octet-stream");
        
        // Write file data to output stream
        try (OutputStream os = connection.getOutputStream(); FileInputStream fis = new FileInputStream(file)) {
            byte[] buffer = new byte[16000];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
        }
        // Check the response code
        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            return "Upload successful: " + responseCode;
        } else {
            return "Upload failed: " + responseCode;
        }
    }

    private boolean fileExists(String bucketName, String fileName) {
        try {
            String url = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
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
        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        connection.setRequestMethod("DELETE");
        connection.setRequestProperty("Authorization", "Bearer " + serviceKey);
        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection   .HTTP_OK) {
            return "File deleted successfully";
        } else {
            throw new IOException("Failed to delete file: " + connection.getResponseMessage());
        }
    }

    public byte[] getFile(String bucketName, String fileName) throws IOException {
        String url = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;
        
        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
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