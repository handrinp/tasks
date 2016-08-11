@echo off

if NOT [%1]==[] goto Correct

echo Incorrect usage. Try "build <dir>"
pause
goto End

:Correct
color 0a
echo ===========================================================
echo     WEBSITE BUILDING...
echo ===========================================================

:Clean
echo -- Clean --------------------
if exist %1\bin\* del %1\bin\* /q
echo -- Clean --------------------
echo.

if [%1]==[_frontpage] goto Minify

:Copy
echo -- Copy ---------------------
if exist %1\src\*.html del %1\src\*.html
for /R _master %%f in (*.html) do copy %%f %1\src
if exist %1\src\*.js del %1\src\*.js
for /R _master %%f in (*.js) do copy %%f %1\src
if exist %1\src\*.css del %1\src\*.css
for /R _master %%f in (*.css) do copy %%f %1\src
echo -- Copy ---------------------
echo.

:AutoBuild
echo -- AutoBuild ----------------
java AutoBuild %1
echo -- AutoBuild ----------------
echo.

:Minify
echo -- Minify -------------------
rd %1\bin /s /q
echo d | xcopy %1\src %1\bin /s /y >NUL
call "C:\Program Files\nodejs\minify.cmd" --output "%1\bin\script.js" "%1\src\script.js"
call "C:\Program Files\nodejs\minify.cmd" --output "%1\bin\styles.css" "%1\src\styles.css"
call "C:\Program Files\nodejs\html-minifier.cmd" --case-sensitive --collapse-whitespace --html5 --quote-character \" --remove-comments --remove-script-type-attributes --remove-style-link-type-attributes --input-dir "%1\src" --output-dir "%1\bin" --file-ext "html"
echo -- Minify -------------------

echo ===========================================================
echo     WEBSITE BUILD COMPLETE
echo ===========================================================
color
:End
