<script>
    export let userAnswers;
    export let score;

    const totalQuestions = userAnswers.length;
</script>

<h1>Auswertung</h1>
<p>Du hast {score} von {totalQuestions} Fragen richtig beantwortet.</p>

<ul>
    {#each userAnswers as answer}
        <li>Frage {answer.id}: Gewählte Antwort {answer.selectedOption}</li>
    {/each}
</ul>

<button on:click={() => location.reload()}>Quiz erneut starten</button>
