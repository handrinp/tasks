@echo off

if NOT [%2]==[] goto Correct

echo Incorrect usage. Try "deploy <dir> <account-id>"
pause
goto End

:Correct
color 0e
echo ===========================================================
echo     WEBSITE DEPLOYING...
echo ===========================================================

:Build dat
java AutoDeploy %1 %2

:FTP
ftp -n -s:ftpcmd.dat www.taskcity.tk
del ftpcmd.dat

echo ===========================================================
echo     WEBSITE DEPLOY COMPLETE
echo ===========================================================
:End
color
