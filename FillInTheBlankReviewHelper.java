import java.awt.*;
import java.awt.datatransfer.*;
import java.awt.event.*;
import java.util.regex.*;
import javax.swing.*;
import javax.swing.text.*;

public class FillInTheBlankReviewHelper {
    private static JTextPane textPane;
    public static void main(String[] args) {
        JFrame frame = new JFrame("Fill in the Blank Review Helper");
        frame.setSize(800, 500);

        textPane = new JTextPane();
        //enables to scroll the textpanel vertically
        JScrollPane scrollPane = new JScrollPane(textPane);
        frame.add(scrollPane, BorderLayout.CENTER);
        //button to paste copied text
        JButton paste = new JButton("Paste Text");
        paste.setToolTipText("Instructions: \n 1. Click the blanks once to get the first word of the answer as a tip \n 2. Click again to see the full answer \n 3. Then click the last time to clear it");
        frame.add(paste, BorderLayout.SOUTH);
        ActionListener pasteText = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e){
                //AI generated
                Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
                try {
                    String text = (String) clipboard.getData(DataFlavor.stringFlavor);
                    deletePart(text);
                } catch (Exception ex) {
                    ex.printStackTrace();
                    JOptionPane.showMessageDialog(null, "Paste failed!");
                }
            }
          };
        paste.addActionListener(pasteText);
        frame.setVisible(true);
    }

    private static void deletePart(String text) {
        
        textPane.setText("");
 
        // Pattern to match both Chinese （） and English () parentheses
        Pattern p = Pattern.compile("（([^）]*)）|\\(([^\\)]*)\\)");  
        Matcher m = p.matcher(text);
        
        int start = 0;
        
        try {
            StyledDocument doc = textPane.getStyledDocument();
            //the part gets the next pattern that matches what we want and adds the part before the ( into the document
            while (m.find()) {
                if (m.start() > start) {
                    doc.insertString(doc.getLength(), text.substring(start, m.start()), null);
                }
                
                // Determine which type of parentheses was matched and get the content
                String info;
                String leftParen, rightParen;
                
                if (m.group(1) != null) {
                    // Chinese parentheses （）
                    info = m.group(1).trim();
                    leftParen = "（";
                    rightParen = "）";
                } else {
                    // English parentheses ()
                    info = m.group(2).trim();
                    leftParen = "(";
                    rightParen = ")";
                }
 
                if (!info.isEmpty()) {
                    //create button
                    JButton button = new JButton("　　");
                    buttonStyle(button);
                    
                    //hint part
                    String firstChar = info.substring(0, 1);
                    
                    doc.insertString(doc.getLength(), leftParen, null);
 
                    button.addActionListener(new ActionListener() {
                        private int clickCount = 0;
                        
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            clickCount++;
                            //hint
                            if (clickCount % 3 == 1) {
                                button.setText(firstChar);
                            }
                            //all definition
                            else if (clickCount % 3 == 2) {
                                button.setText(info);
                            }
                            else {
                                //empty
                                button.setText("　　");
                            }
                        }
                    });
                    //add button inside the ()
                    insertButton(doc, button);
                    doc.insertString(doc.getLength(), rightParen, null);
                }
                else {
                    //just put () when there's nothing inside ()
                    doc.insertString(doc.getLength(), leftParen + rightParen, null);
                }
                
                start = m.end();
            }
            
            if (start < text.length()) {
                Style fontSize = doc.addStyle("fontSize", null);
                StyleConstants.setFontSize(fontSize, 20);
                doc.setCharacterAttributes(0, doc.getLength(), fontSize, false);
                doc.insertString(doc.getLength(), text.substring(start), null);
            }
            
        } catch (BadLocationException e) {
            e.printStackTrace();
        }
    }
 
 

    private static void buttonStyle(JButton button) {
        //remove the border from button
        button.setBorderPainted(false);
        //when the cursor goes to the button, it turns to hand
        button.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        //set color of text to blue
        button.setForeground(Color.BLUE);
        button.setFont(new Font("Arial", Font.PLAIN, 20));
    }

    private static void insertButton(StyledDocument doc, JButton button) {
        try {
            //style is used to define embedded parts in StyledDocument
            //define new style, with unique name "ButtonStyle" does not inherit anything
            Style style = doc.addStyle("ButtonStyle", null);
            //StyleConstants: A helper class for defining text styles
            //setComponent: method that links JComponent to style.
            StyleConstants.setComponent(style, button);
            //insert button to the end of the styled document
            //" " is used as a placeholder
            //" " is replaced by the component in style, JButton
            Style fontSize = doc.addStyle("fontSize", null);
            StyleConstants.setFontSize(fontSize, 20);


         //Setting the font Size
         doc.setCharacterAttributes(0, doc.getLength(), fontSize, false);
            doc.insertString(doc.getLength(), " ", style);
        } catch (BadLocationException e) {
            e.printStackTrace();
        }
    }
}
