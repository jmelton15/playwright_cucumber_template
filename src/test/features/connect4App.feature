@Connect4App
Feature: Connect Four Application Tests

    @VerifyConnect4
    Scenario: Verify Page Setup
        Given Navigate to connect four App
        Then Verify main header text is "Play Connect-4"
        Then Verify player one image url is 
            """
            YellowPiece.png
            """
        Then Select Red Piece from token selectbox with select index 1
        Then Verify player one image is now red piece 
            """
            RedPiece.png
            """