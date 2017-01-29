import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;

import java.util.Scanner;

public class AutoDeploy {
  private static final String DAT_FILE_NAME = "ftpcmd.dat";
  private static final String CRED_FILE_NAME = "cred.txt";
  
  public static void main(String[] args) throws FileNotFoundException {
    if (args.length != 2) {
      System.out.println("Invalid number of arguments. Try \"java AutoBuild <directory-name> <account-id>\".");
      System.exit(0);
    }
    
    System.out.printf("Building %s...%n", DAT_FILE_NAME);
    
    String dirName = args[0];
    String accountId = args[1];
    
    String binFileName = String.format("%s%s%s", dirName, File.separator, "bin");
    File credFile = new File(CRED_FILE_NAME);
    File datFile = new File(DAT_FILE_NAME);
    File binFile = new File(binFileName);
    PrintWriter oWriter = new PrintWriter(datFile);
    
    // get ftp login credentials
    Scanner credScanner = new Scanner(credFile);
    String username = credScanner.nextLine();
    String password = credScanner.nextLine();
    credScanner.close();
    
    oWriter.printf("user %s%n", username);
    oWriter.println(password);
    oWriter.println("binary");
    oWriter.println("cd public_html");
    oWriter.printf("mkdir %s%n", accountId);
    oWriter.printf("cd %s%n", accountId);
    
    for (String fName : binFile.list()) {
      String fullName = String.format("%s%s%s%s%s", dirName, File.separator, "bin", File.separator, fName);
      oWriter.printf("put %s%n", fullName);
    }
    
    oWriter.println("quit");
    oWriter.close();
    
    System.out.printf(" done!%n");
  }
}
