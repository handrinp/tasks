import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Scanner;

public class AutoBuild {
  public static final String MASTER_DIR = "_master";
  
  public static void main(String[] args) throws FileNotFoundException {
    if (args.length != 1) {
      System.out.println("Invalid number of arguments. Try \"java AutoBuild <directory-name>\".");
      System.exit(0);
    }
    
    String dirName = args[0];
    
    String defaultFileName = String.format("%s%s%s", MASTER_DIR, File.separator, "default.txt");
    String autoFileName = String.format("%s%s%s", dirName, File.separator, "auto.txt");
    
    File defaultFile = new File(defaultFileName);
    File autoFile = new File(autoFileName);
    
    Scanner autoScanner = new Scanner(autoFile);
    Scanner defaultScanner = new Scanner(defaultFile);
    
    HashMap<String, String[]> map = new HashMap<String, String[]>();
    fillMap(map, defaultScanner);
    fillMap(map, autoScanner);
    
    for (Entry<String, String[]> entry : map.entrySet()) {
      String fName = entry.getKey();
      System.out.printf("Building %s...%n", fName);
      String[] autoValues = entry.getValue();
      
      String masterName = String.format("%s%s%s", MASTER_DIR, File.separator, fName);
      String oFileName = String.format("%s%s%s%s%s", dirName, File.separator, "src", File.separator, fName);
      File masterFile = new File(masterName);
      File oFile = new File(oFileName);
      Scanner masterScanner = new Scanner(masterFile);
      PrintWriter oWriter = new PrintWriter(oFile);
      
      while (masterScanner.hasNextLine()) {
        String line = masterScanner.nextLine();
        
        if (line.contains("__")) {
          int fillBegin = line.indexOf("__");
          int fillEnd = line.indexOf("__", fillBegin + 2);
          String lFirst = line.substring(0, fillBegin);
          String lSecond = line.substring(fillEnd + 2);
          int i = Integer.parseInt(line.substring(fillBegin + 2, fillEnd));
          oWriter.printf("%s%s%s%n", lFirst, autoValues[i], lSecond);
        } else {
          oWriter.println(line);
        }
      }
      
      masterScanner.close();
      oWriter.close();
    }
    
    System.out.printf(" done!%n");
  }
  
  private static void fillMap(HashMap<String, String[]> map, Scanner in) {
    while (in.hasNextLine()) {
      String line = getNextLine(in);
      
      String[] firstLineToken = line.split(":");
      int numFills = Integer.parseInt(firstLineToken[0]);
      String fillFileName = firstLineToken[1];
      map.putIfAbsent(fillFileName, new String[numFills]);
      System.out.printf("Reading in rules for %s...%n", fillFileName);
      line = getNextLine(in);
      
      while (line.charAt(0) != '!') {
        int equalsPos = line.indexOf("=");
        int i = Integer.parseInt(line.substring(0, equalsPos));
        map.get(fillFileName)[i] = line.substring(equalsPos + 1);
        line = getNextLine(in);
      }
    }
    
    in.close();
  }
  
  private static String getNextLine(Scanner in) {
    String line = "";
      
      while (line.equals("") || line.charAt(0) == '#') {
        line = in.nextLine();
      }
      
      return line;
  }
}
