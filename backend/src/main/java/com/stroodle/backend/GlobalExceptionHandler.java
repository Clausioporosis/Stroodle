package com.stroodle.backend;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Ressource Not Found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException ex) {
        ApiError apiError = new ApiError(HttpStatus.NOT_FOUND, ex.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    // Server Error
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception ex) {
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "An internal error has occurred.",
                LocalDateTime.now());
        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Bad Request (Feld falsch ausgefüllt)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // Bad Request (ID schon vorhanden)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, ex.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

}
