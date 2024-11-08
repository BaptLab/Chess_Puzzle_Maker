package com.puzzleCraft.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.puzzleCraft.controller.PuzzleController;
import com.puzzleCraft.models.Puzzle;
import com.puzzleCraft.repositories.PuzzleRepository;

import java.util.List;

@Service
public class PuzzleService {
    
    @Autowired
    private PuzzleRepository puzzleRepository;
    private static final Logger logger = LoggerFactory.getLogger(PuzzleController.class);

    public List<Puzzle> getRandomPuzzles(String theme, Integer minRating, Integer maxRating, int count) {
        // Log the parameters explicitly
        logger.info("Querying with parameters - Theme: {}, Min Rating: {}, Max Rating: {}, Count: {}", theme, minRating, maxRating, count);
        
        Pageable pageable = PageRequest.of(0, count);
        
        // Retrieve puzzles
        List<Puzzle> puzzles = puzzleRepository.findRandomPuzzles(theme, minRating, maxRating, pageable);
        
        // Log the result
        logger.info("Retrieved puzzles: {}", puzzles);
        

        return puzzles;
    }
}
