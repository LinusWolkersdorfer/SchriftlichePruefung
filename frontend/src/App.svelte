<script>
    import Quiz from './Quiz.svelte';
    import Evaluation from './Evaluation.svelte';

    // Zustände
    let isEvaluation = false;
    let userAnswers = [];
    let score = 0;

    // Datei für CSV-Upload
    let file;

    // Funktion, um die CSV-Datei an das Backend zu senden
    async function uploadCSV() {
        if (!file) {
            alert("Bitte wähle eine CSV-Datei aus!");
            return;
        }

        const formData = new FormData();
        formData.append("csv", file);

        try {
            const response = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("CSV-Datei erfolgreich hochgeladen und Fragen importiert!");
            } else {
                alert("Fehler beim Hochladen der Datei.");
            }
        } catch (error) {
            alert("Ein Fehler ist aufgetreten: " + error.message);
        }
    }

    function handleFinishQuiz(answers, finalScore) {
        userAnswers = answers;
        score = finalScore;
        isEvaluation = true;
    }
</script>

<main>
    <h1>Quiz App</h1>

    <!-- CSV-Datei hochladen -->
    <div>
        <h2>Fragen hochladen</h2>
        <input type="file" accept=".csv" bind:this={file} />
        <button on:click={uploadCSV}>CSV hochladen</button>
    </div>

    <!-- Quiz oder Auswertung anzeigen -->
    {#if !isEvaluation}
        <Quiz on:finishQuiz={handleFinishQuiz} />
    {:else}
        <Evaluation {userAnswers} {score} />
    {/if}
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        margin: 2rem;
    }

    div {
        margin-bottom: 2rem;
    }

    button {
        margin-top: 0.5rem;
    }
</style>
