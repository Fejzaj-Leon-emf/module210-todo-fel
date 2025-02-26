const apiEndpoint = "https://ci-cd-backend-fejzaj-byguegb4bebjgsa2.northeurope-01.azurewebsites.net/api/tasks";

$(document).ready(function () {
  loadTasks();

  // Ajout d'une tâche dans la colonne "À faire"
  $(".task-form").on("submit", async function (e) {
    e.preventDefault();
    const input = $(this).find("input");
    const description = input.val().trim();
    if (description === "") return;
    const newTask = { description: description, status: "todo" };

    try {
      await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      input.val("");
      loadTasks();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
    }
  });

  // Fonction de chargement des tâches et attribution aux colonnes
  async function loadTasks() {
    try {
      const response = await fetch(apiEndpoint);
      const tasks = await response.json();

      // Vider tous les conteneurs de tâches
      $(".task-container").empty();

      tasks.forEach((task) => {
        // Créer l'élément tâche et le rendre draggable
        const taskEl = $("<div>")
          .addClass("task")
          .attr("draggable", "true")
          .text(task.description)
          .data("id", task.id);

        // Gestion du dragstart
        taskEl.on("dragstart", function (e) {
          e.originalEvent.dataTransfer.setData("text/plain", task.id);
        });

        // Attribution à la colonne selon le statut
        if (task.status === "todo") {
          $("#todo .task-container").append(taskEl);
        } else if (task.status === "in-progress") {
          $("#in-progress .task-container").append(taskEl);
        } else if (task.status === "done") {
          $("#done .task-container").append(taskEl);
        }
      });
    } catch (error) {
      console.error("Erreur lors du chargement des tâches :", error);
    }
  }

  // Gestion du drag & drop pour chaque conteneur de tâches
  $(".task-container").on("dragover", function (e) {
    e.preventDefault();
    $(this).addClass("dragover");
  });

  $(".task-container").on("dragleave", function (e) {
    $(this).removeClass("dragover");
  });

  $(".task-container").on("drop", function (e) {
    e.preventDefault();
    $(this).removeClass("dragover");
    const taskId = e.originalEvent.dataTransfer.getData("text/plain");

    // Déterminer le nouveau statut en fonction de la colonne parent
    const newStatus = $(this).closest(".kanban-column").attr("id");

    // Récupérer la description actuelle (pour simplifier)
    const taskEl = $(".task").filter(function () {
      return $(this).data("id") == taskId;
    });
    const description = taskEl.text();

    const updatedTask = {
      id: taskId,
      description: description,
      status: newStatus,
    };

    // Mise à jour de la tâche via l'API
    fetch(apiEndpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then(() => loadTasks())
      .catch((error) =>
        console.error("Erreur lors de la mise à jour de la tâche :", error)
      );
  });
});
